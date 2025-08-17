/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // TODO: Enable these once we've fixed the issues
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",

    // Prevent Node.js built-in module imports without type-only
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["stream", "fs", "path", "crypto", "os", "child_process", "url", "util"],
            message:
              'Node.js built-in modules should use type-only imports. Use: import type { ... } from "..."',
          },
        ],
      },
    ],
  },
};
