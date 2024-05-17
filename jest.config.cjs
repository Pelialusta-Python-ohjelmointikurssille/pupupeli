module.exports = {
    collectCoverage: true,
    coverageReporters: ["text", "cobertura"],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ["**/?(*.)+(test).js?(x)"], // Ensure it matches your test files
};
