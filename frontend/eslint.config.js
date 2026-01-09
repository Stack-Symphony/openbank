// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["*.ts", "*.tsx", "**/*.ts", "**/*.tsx"], // include all TS/TSX files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // important for React TSX
        },
        project: "./tsconfig.json", // use TS config for types
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    rules: {
      "quotes": ["error", "double"],          // double quotes
      "semi": ["error", "always"],            // semicolons
      "no-unused-vars": ["warn"],             // warn about unused vars
      "react/react-in-jsx-scope": "off",      // not needed in React 17+
    },
  },
];
