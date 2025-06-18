/** @type {import('jest').Config} */
/* eslint-env node */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Test file patterns
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.spec.ts"],

  // Module path mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@deepgram/sdk$": "<rootDir>/src/index.ts",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
  ],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json"],

  // Test timeout
  testTimeout: 10000,

  // Transform configuration
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "js", "json"],

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Force Jest to exit after tests complete
  // This prevents hanging caused by lingering HTTP connections (TLSWRAP handles)
  forceExit: true,
};
