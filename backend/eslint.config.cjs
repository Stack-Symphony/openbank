// eslint.config.cjs
module.exports = [
  {
    // Apply these rules to all JS files
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": ["warn"],
      "no-console": ["off"],
    },
    ignores: ["node_modules/**"],
  },
];
