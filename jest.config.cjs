module.exports = {
    collectCoverage: true,
    coverageReporters: ["text", "cobertura", "html"],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ["**/?(*.)+(test).js?(x)"],
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
        "!src/**/index.js",
        "!src/**/game.js",
        "!src/**/editor.js",
        "!src/**/example/**", // Exclude all files in specific directory
        "!src/**/objects/**" 
    ]
};
