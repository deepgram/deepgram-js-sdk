/**
 * Test fixtures for Read (Text Analysis) API
 */

/**
 * Test text sources for Read API (text analysis) scenarios
 */
export const testReadSources = {
  simpleText: { text: "Hello world, this is a test." },
  complexText: {
    text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  },
  sentimentText: { text: "I absolutely love this product! It's amazing and works perfectly." },
  urlSource: { url: "https://example.com/article.txt" },
} as const;

/**
 * Common analysis options for Read API tests
 */
export const commonAnalysisOptions = {
  sentiment: true,
  summarize: true,
  intents: true,
  language: "en",
} as const;

/**
 * Callback URLs for async operations
 */
export const callbackUrls = {
  webhook: "https://your-webhook-url.com/callback",
  testEndpoint: "https://test-callback.example.com/webhook",
} as const;
