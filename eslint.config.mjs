import globals from "globals";
import pluginJs from "@eslint/js";


export default [

    {
        ignores: [
            "**/test/**",
            "**/tests/**",
            "**/*.test.js"
        ]
    },
    {
        files: [
            "**/*.js"
        ], 
    },
    {
        languageOptions: {
            globals: globals.browser,
            sourceType: "module"
        }
    },
    pluginJs.configs.recommended
];
