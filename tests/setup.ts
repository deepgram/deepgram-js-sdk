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

  // Mock console methods for cleaner test output (optional)
  if (process.env.JEST_SILENT !== "false") {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  }
});

afterAll(() => {
  // Restore console methods
  jest.restoreAllMocks();
});
