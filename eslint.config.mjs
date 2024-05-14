import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  // {
  //   ignores: ["scripts/tests/*"]
  // },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];