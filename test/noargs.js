const { execSync } = require('child_process');

async function test() {
    const total_tests = 8;
    let successful_tests = 0;
    let success = false;

    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init javascript');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init typescript');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init express');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init next');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init discord');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init react');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init angular');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
    execSync('rm -rf test-template && mkdir test-template && cd test-template && better-init');
    successful_tests += 1;
    success = successful_tests > (total_tests / 4) * 3;
    console.log(`${success ? 'SUCCESS' : 'FAILURE'} ${successful_tests}/${total_tests}`);
}

test();