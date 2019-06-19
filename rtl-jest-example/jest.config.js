module.exports = {
    ...require('./test/jest-common'),
    collectCoverageFrom: [
        '**/src/**/*.tsx',
        '!**/__tests__/**',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            statements: 10,
            branches: 5,
            functions: 15,
            lines: 8,
        },
        './src/components/**/*.tsx': {
            statements: 60,
            branches: 40,
            functions: 55,
            lines: 25,
        },
    },
    projects: [
        './test/jest.client.js',
        // enable if you have a proper eslint configuration
        // './test/jest.lint.js',
    ],
};
