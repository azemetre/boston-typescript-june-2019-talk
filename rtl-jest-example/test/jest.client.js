module.exports = {
    ...require('./jest-common'),
    displayName: 'client',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/__tests__/**/*.test.tsx'],
    setupFilesAfterEnv: [
        '<rootDir>/test/setup-tests.js',
    ]
};
