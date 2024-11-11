import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  { rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "json": "always"
        }
      ],
      "import/no-unresolved": "off"
    }
  }
];