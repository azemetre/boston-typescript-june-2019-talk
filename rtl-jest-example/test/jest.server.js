const path = require('path');

module.exports = {
    ...require('./jest-common'),
    displayName: 'server',
    testEnvironment: 'jest-environment-node',
    coverageDirectory: path.join(__dirname, '../coverage/server'),
    testMatch: ['**/__server_tests__/**/*.test.ts']
};