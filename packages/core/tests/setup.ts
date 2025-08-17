import "jest";
import dotenv from "dotenv";

/**
 * Test Setup for Deepgram JS SDK
 *
 * IMPORTANT: AI transcription services are non-deterministic!
 * The same audio file may produce different (but valid) transcriptions on different calls.
 * Our tests focus on structural validation and quality metrics rather than exact content matching.
 */

// Load environment variables from .env file
dotenv.config();

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = "test";

  // Configure environment for better offline testing
  // This helps ensure tests don't accidentally make real network calls
  if (!process.env.DEEPGRAM_API_KEY) {
    process.env.DEEPGRAM_API_KEY = "mock-api-key-for-testing";
  }

  // Mock console methods for cleaner test output (optional)
  if (process.env.JEST_SILENT !== "false") {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  }
});

afterAll(async () => {
  // Restore console methods
  jest.restoreAllMocks();

  // Force close HTTP connections to prevent Jest hanging
  // This addresses the TLSWRAP handles that keep Jest from exiting
  if (typeof global.gc === "function") {
    global.gc();
  }

  // Give a small delay to allow cleanup
  await new Promise((resolve) => setTimeout(resolve, 100));
});
