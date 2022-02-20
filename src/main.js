import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import gitignore from 'gitignore';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import { projectInstall } from 'pkg-install';
import license from 'spdx-license-list/licenses/MIT';
import { promisify } from 'util';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const writeGitignore = promisify(gitignore.writeFile);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

async function createGitignore(options) {
    const file = fs.createWriteStream(
        path.join(options.targetDirectory, '.gitignore'), { flags: 'a' }
    );
    return writeGitignore({
        type: 'Node',
        file: file,
    });
}

async function createLicense(options) {
    const targetPath = path.join(options.targetDirectory, 'LICENSE');
    const licenseContent = license.licenseText
        .replace('<year>', new Date().getFullYear())
    return writeFile(targetPath, licenseContent, 'utf8');
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

export async function createProject(options) {
    console.log('%s Checking options', chalk.yellow.bold('WAITING'));

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const check_option_tasks = new Listr([{
        title: 'Validating options',
        task: async() => {
            const fullPathName = new URL(
                import.meta.url).pathname;
            const templateDir = path.resolve(
                fullPathName.substr(fullPathName.indexOf('/')),
                options.use_yarn ? '../../templates/npm' : '../../templates/npm',
                options.template.toLowerCase()
            ).slice(3);
            options.templateDirectory = templateDir;

            try {
                await access(templateDir, fs.constants.R_OK);
            } catch (err) {
                console.error('%s Invalid template name', chalk.red.bold('ERROR'));
                process.exit(1);
            }
        }
    }]);

    await check_option_tasks.run();

    console.log('%s Options valid', chalk.green.bold('SUCCESS'));
    console.log('%s Setting up project', chalk.yellow.bold('WAITING'));

    const tasks = new Listr(
        [{
                title: 'Copy project files',
                task: () => copyTemplateFiles(options),
            },
            {
                title: 'Create License',
                task: () => createLicense(options),
            },
            {
                title: 'Initialize git',
                task: () => initGit(options),
                skip: () =>
                    !options.git ?
                    'Pass --git to automatically initialize git' : undefined,
            },
            {
                title: 'Create gitignore',
                task: () => createGitignore(options),
                skip: () =>
                    !options.git ?
                    'Pass --git to automatically create a .gitignore' : undefined,
            },
            {
                title: 'Install dependencies',
                task: () =>
                    projectInstall({
                        cwd: options.targetDirectory,
                    }),
                skip: () =>
                    !options.runInstall ?
                    'Pass --install to automatically install dependencies' : undefined,
            },
        ], {
            exitOnError: false,
        }
    );

    await tasks.run();
    console.log('%s Project ready', chalk.green.bold('SUCCESS'));
    return true;
}