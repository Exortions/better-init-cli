import { createProject } from './main';
import inquirer from 'inquirer';
import arg from 'arg';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '--help': Boolean,
        '--yarn': Boolean,
        '-g': '--git',
        '-c': '--yes',
        '-i': '--install',
        '-h': '--help',
        '-y': '--yarn',
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        help: args['--help'] || false,
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        use_yarn: args['--yarn'] || false,
        runInstall: args['--install'] || false,
    };
}
async function promptForMissingOptions(options) {
    const defaultPackageManager = 'NPM';
    const defaultTemplate = 'javascript';
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
        };
    }

    if (options.help) {
        console.log(`Usage: better-npm-init <template> [--yarn] [--install] [--git] [--yes] [--help]`);
        return 'HELP_REQUESTED';
    }

    const questions = [];

    if (!options.use_yarn) {
        questions.push({
            type: 'list',
            name: 'use_yarn',
            message: 'Which package manager would you like to use?',
            choices: ['NPM', 'Yarn'],
            default: defaultPackageManager,
        });
    }

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose which project template to use',
            choices: ['JavaScript', 'TypeScript', 'Express', 'Next', 'Discord', 'React', 'Angular'],
            default: defaultTemplate,
        });
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        });
    }

    if (!options.runInstall) {
        questions.push({
            type: 'confirm',
            name: 'install',
            message: 'Install dependencies?',
            default: false,
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
        runInstall: options.runInstall || answers.install,
        use_yarn: options.use_yarn || answers.use_yarn,
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    const prompt = await promptForMissingOptions(options);
    if (prompt === 'HELP_REQUESTED') return;
    options = prompt;
    await createProject(options);
}