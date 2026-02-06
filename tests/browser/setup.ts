const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}`;

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

// Export base URL for tests
export const TEST_BASE_URL = BASE_URL;

