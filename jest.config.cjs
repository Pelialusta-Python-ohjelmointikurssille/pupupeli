module.exports = {
    collectCoverage: true,
    coverageReporters: ["text", "cobertura"],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
}