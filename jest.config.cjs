module.exports = {
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ["text", "cobertura", "html"],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ["**/?(*.)+(test).js?(x)"],
    testPathIgnorePatterns: [],
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
        //"!src/**/rendering.js", // Exclude specific file
        "!src/util/version_strings.js",
        "!src/input/worker.js",
        "!src/event_handler.js",
        "!src/**/index.js",
        "!src/**/game.js",
        "!src/**/editor.js",
        //"!src/**/graphics_camera_entity.js", // some of these can be mock tested
        //"!src/**/graphics_entity_factory.js",
        //"!src/**/graphics_entity_handler.js",
        //"!src/**/graphics_handler.js",
        //"!src/**/animation_progress.js",
        "!src/**/graphics_handler/manifests/**",
        "!src/**/pixi_renderer.js",
        "!src/**/example/**", // Exclude all files in specific directory
        "!src/**/objects/**",
        //"!src/**/graphics_handler/entities/**",
        //"!src/**/graphics_handler/animations/**", // can be mock tested
        "!src/**/tests/**",
        "!src/**/ui/**",
        "!src/util/globals.js",
        "!src/**/commonstrings.js", //no need to test, no need to check if a constant string is what it is declared to be when it doesn't even matter
        "!src/api/api.js", 
    ]
};
