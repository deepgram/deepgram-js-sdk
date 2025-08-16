import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { callbackUrls, testReadSources, commonAnalysisOptions } from "../__fixtures__/read";
import type { DeepgramResponse, AsyncAnalyzeResponse } from "../../src/core/lib/types";
import { CallbackUrl } from "../../src/core/lib/helpers";

describe("read analyzeUrlCallback E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    // Set up API mocks (only active when not updating snapshots)
    setupApiMocks();

    // Use mock API key when mocking, real one when updating snapshots
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    deepgram = createClient(apiKey);

    // Add our custom serializer
    expect.addSnapshotSerializer(structureOnlySerializer);
  });

  afterAll(() => {
    // Clean up mocks
    cleanupApiMocks();
  });

  it("should analyze URL with callback and return async response", async () => {
    const response: DeepgramResponse<AsyncAnalyzeResponse> = await deepgram.read.analyzeUrlCallback(
      testReadSources.urlSource,
      new CallbackUrl(callbackUrls.webhook),
      commonAnalysisOptions
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("request_id");
      expect(typeof response.result.request_id).toBe("string");
      expect(response.result.request_id.length).toBeGreaterThan(0);
    }

    expect(response).toMatchSnapshot("read-analyze-url-callback-response-structure");
  });

  it("should handle basic analysis options with callback", async () => {
    const response: DeepgramResponse<AsyncAnalyzeResponse> = await deepgram.read.analyzeUrlCallback(
      testReadSources.urlSource,
      new CallbackUrl(callbackUrls.testEndpoint),
      { sentiment: true }
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.request_id).toBeDefined();
      expect(typeof response.result.request_id).toBe("string");
    }
  }, 30000); // 30 second timeout for API call
});
