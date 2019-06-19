module.exports = {
    ...require('./jest-common'),
    displayName: 'client',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/__tests__/**/*.test.tsx'],
    // issues with correctly defining jest plugins prior to test execution
    // refer to docs for more info - https://jestjs.io/docs/en/configuration#setupfilesafterenv-array
    setupFilesAfterEnv: [
        '<rootDir>/test/setup-tests.js',
    ]
};
