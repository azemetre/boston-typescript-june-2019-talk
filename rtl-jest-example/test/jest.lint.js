const { rootDir } = require('./jest-common');

module.exports = {
    rootDir,
    displayName: 'lint',
    runner: 'jest-runner-eslint',
    testMatch: ['<rootDir>/**/*.(ts|tsx)'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/test/'],
};
