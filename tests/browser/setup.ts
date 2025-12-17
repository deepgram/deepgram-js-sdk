import { beforeAll } from "vitest";
import { chromium } from "playwright";

// Set up browser environment before tests
beforeAll(async () => {
  // Ensure Playwright browsers are installed
  // This will be handled automatically by vitest browser provider
});

// Helper to get API key from environment
export function getApiKey(): string {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY environment variable is required for browser tests");
  }
  return apiKey;
}

// Helper to get project ID from environment (optional)
export function getProjectId(): string | undefined {
  return process.env.DEEPGRAM_PROJECT_ID;
}

