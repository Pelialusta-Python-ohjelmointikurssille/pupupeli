module.exports = {
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ["text", "cobertura", "html"],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ["**/?(*.)+(test).js?(x)"],
    testPathIgnorePatterns: ["src/tests/file_reader.test.js"],
    coverageThreshold: {
        global: {
            branches: 75,
        }
    },
    reporters: [
        "default",
        ["jest-html-reporters", {
            "publicPath": "./html-report",
            "filename": "report.html",
            "expand": true,
            "darkTheme": true
        }]
    ],
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/**/rendering.js", // Exclude specific file
        "!src/util/version_strings.js",
        "!src/input/worker.js",
        "!src/event_handler.js",
        "!src/file_reader.js",
        "!src/**/index.js",
        "!src/**/game.js",
        "!src/**/editor.js",
        "!src/**/example/**", // Exclude all files in specific directory
        "!src/**/objects/**",
        "!src/**/tests/**"
    ]
};
