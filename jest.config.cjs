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
        "!src/**/rendering.js", // Exclude specific file
        "!src/util/version_strings.js",
        "!src/input/worker.js",
        "!src/event_handler.js",
        "!src/**/index.js",
        "!src/**/ui.js",
        "!src/**/game.js",
        "!src/**/editor.js",
        "!src/**/graphics_camera_entity.js",
        "!src/**/graphics_entity_factory.js",
        "!src/**/graphics_entity_handler.js",
        "!src/**/graphics_handler.js",
        "!src/**/move_tween.js",
        "!src/**/pixi_renderer.js",
        "!src/**/example/**", // Exclude all files in specific directory
        "!src/**/objects/**",
        "!src/**/graphics_handler/entities/**",
        "!src/**/tests/**"
    ]
};
