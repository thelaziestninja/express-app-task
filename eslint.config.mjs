import js from "@eslint/js";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": tsConfigs,
    },
    rules: {
      // Add custom rules here if needed
    },
    ignores: ["node_modules/**"],
  },
  js.configs.recommended,
  tsConfigs.recommended,
];
