import globals from "globals";
import pluginJs from "@eslint/js";
import { configs as tseslint } from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import typescriptParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import pluginQuery from "@tanstack/eslint-plugin-query";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...pluginQuery.configs["flat/recommended"],
  { ignores: ["**/*.csv", "**/*.svg", "**/src/client/*"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
        React: true,
        JSX: true,
      },
      ecmaVersion: 2025,
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2025,
        sourceType: "module",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  vitest.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        typescript: {},
      },
    },
    rules: {
      indent: ["error", 2],
      "no-use-before-define": "off",
      "no-unused-vars": "off",
      "no-param-reassign": ["error", { props: false }],
      "no-undef": "off",
      "no-shadow": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "global-require": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
        },
      ],
      "@typescript-eslint/no-shadow": ["error"],
      "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
      "react/jsx-props-no-spreading": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
    },
  },
  eslintPluginPrettierRecommended,
];
