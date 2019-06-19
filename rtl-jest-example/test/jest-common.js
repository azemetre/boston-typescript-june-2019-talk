const path = require('path');

module.exports = {
    rootDir: path.join(__dirname, '..'),
    moduleDirectories: [
        'node_modules',
        path.join(__dirname, '../src'),
    ],
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '.+\\.(css|styl)$': '<rootDir>/node_modules/jest-css-modules-transform',
    },
    moduleNameMapper: {
        '\\.(css|styl)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: [
        'js',
        'ts',
        'tsx',
        'json',
    ],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
        'jest-watch-select-projects',
    ],
};
