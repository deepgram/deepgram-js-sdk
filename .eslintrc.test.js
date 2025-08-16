// .eslintrc.test.js - ESLint configuration specifically for test files
module.exports = {
  rules: {
    // Relax the Node.js built-in module import restriction for tests
    // Tests often need to use fs, path, etc. as actual values, not just types
    "no-restricted-imports": "off",

    // Allow more flexible patterns in tests
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    "@typescript-eslint/no-unused-vars": "warn", // Downgrade to warning in tests

    // Allow console.log in tests for debugging
    "no-console": "off",

    // Allow require() in tests for dynamic imports
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-require-imports": "off",
  },
  env: {
    jest: true, // Enable Jest global variables
    node: true,
  },
};
