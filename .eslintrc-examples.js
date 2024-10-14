module.exports = {
  ignorePatterns: ["examples/disabled_deno-prerecorded/index.js"],
  root: true,
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
