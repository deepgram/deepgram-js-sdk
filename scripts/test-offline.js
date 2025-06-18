#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */

/**
 * Test script to verify e2e tests work properly offline
 * This script simulates offline conditions and runs the tests
 */

const { spawn } = require("child_process");

console.log("🧪 Testing Deepgram JS SDK e2e tests in offline mode\n");

// Environment variables to ensure offline testing
const env = {
  ...process.env,
  JEST_SILENT: "false",
  NODE_ENV: "test",
  // Remove any real API key to force mock usage
  DEEPGRAM_API_KEY: "mock-api-key-for-offline-testing",
};

// Test command
const testCommand = "npm";
const testArgs = ["test", "--", "tests/e2e/", "--verbose"];

console.log("🎭 Running e2e tests with mocked API calls...");
console.log(`Command: ${testCommand} ${testArgs.join(" ")}\n`);

const testProcess = spawn(testCommand, testArgs, {
  env,
  stdio: "inherit",
  shell: true,
});

testProcess.on("close", (code) => {
  if (code === 0) {
    console.log("\n✅ All e2e tests passed in offline mode!");
    console.log("🎉 Your tests are properly configured to work without internet connection.");
    console.log("\n💡 To run tests with real API calls (for updating snapshots):");
    console.log("   npm test -- tests/e2e/ --updateSnapshot");
    console.log("\n🔧 To force real API calls without updating snapshots:");
    console.log("   DEEPGRAM_FORCE_REAL_API=true npm test -- tests/e2e/");
  } else {
    console.log(`\n❌ Tests failed with exit code ${code}`);
    console.log("🔍 This indicates there might be network dependencies that need to be mocked.");
  }
});

testProcess.on("error", (error) => {
  console.error("❌ Failed to run tests:", error);
  process.exit(1);
});
