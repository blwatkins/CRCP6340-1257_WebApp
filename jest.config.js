/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
    clearMocks: true,

    collectCoverage: true,
    coverageDirectory: './out/tests-coverage',
    coverageReporters: ['text', 'lcov', 'json', 'json-summary', 'clover'],
    coverageProvider: 'v8',

    errorOnDeprecated: true,

    verbose: true,

    forceExit: true,
    detectOpenHandles: true,

    testEnvironment: 'node'
};

export default config;
