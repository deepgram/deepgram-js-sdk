import { createClient } from "../../src/index";
import { ReadRestClient } from "../../src/core/packages/ReadRestClient";
import { DeepgramError } from "../../src/core/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testReadSources, commonAnalysisOptions } from "../__fixtures__/read";

describe("read analyzeText E2E", () => {
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

  it("should analyze text synchronously", async () => {
    const { result, error } = await deepgram.read.analyzeText(
      testReadSources.simpleText,
      commonAnalysisOptions
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("read-analyzeText-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("metadata");
    expect(result).toHaveProperty("results");

    // Verify metadata structure
    expect(result.metadata).toHaveProperty("request_id");
    expect(result.metadata).toHaveProperty("created");
    expect(typeof result.metadata.request_id).toBe("string");
    expect(typeof result.metadata.created).toBe("string");

    // Verify results structure based on requested analysis options
    if (commonAnalysisOptions.sentiment) {
      expect(result.results).toHaveProperty("sentiments");
      if (result.results.sentiments) {
        expect(result.results.sentiments).toHaveProperty("segments");
        expect(Array.isArray(result.results.sentiments.segments)).toBe(true);
      }
    }

    if (commonAnalysisOptions.intents) {
      expect(result.results).toHaveProperty("intents");
      if (result.results.intents) {
        expect(result.results.intents).toHaveProperty("segments");
        expect(Array.isArray(result.results.intents.segments)).toBe(true);
      }
    }

    if (commonAnalysisOptions.summarize) {
      expect(result.results).toHaveProperty("summary");
    }
  }, 30000);

  it("should analyze text with different analysis options", async () => {
    const sentimentOnlyOptions = {
      sentiment: true,
      language: "en",
    };

    const { result, error } = await deepgram.read.analyzeText(
      testReadSources.sentimentText,
      sentimentOnlyOptions
    );

    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    expect(result).toHaveProperty("results");

    // Should have sentiment analysis since it was requested
    expect(result.results).toHaveProperty("sentiments");

    // Verify sentiment structure
    const sentiments = result.results.sentiments;
    if (sentiments) {
      expect(sentiments).toHaveProperty("segments");
      expect(Array.isArray(sentiments.segments)).toBe(true);

      if (sentiments.segments.length > 0) {
        const segment = sentiments.segments[0];
        expect(segment).toHaveProperty("sentiment");
        expect(segment).toHaveProperty("sentiment_score");
        expect(typeof segment.sentiment).toBe("string");
        expect(typeof segment.sentiment_score).toBe("number");
      }
    }
  }, 30000);

  it("should reject synchronous analysis with callback option", async () => {
    const optionsWithCallback = {
      ...commonAnalysisOptions,
      callback: "https://example.com/callback",
    };

    const { result, error } = await deepgram.read.analyzeText(
      testReadSources.simpleText,
      optionsWithCallback
    );

    // Should return an error, not throw
    expect(result).toBeNull();
    expect(error).toBeTruthy();
    expect(error?.message).toContain("Callback cannot be provided as an option to a synchronous");
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const readClient = new ReadRestClient({ key: apiKey });

    // Mock the post method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(readClient as any, "post").mockRejectedValue(mockError);

    const { result, error } = await readClient.analyzeText(
      testReadSources.simpleText,
      commonAnalysisOptions
    );

    expect(result).toBeNull();
    expect(error).toBe(mockError);
    expect(error).toBeInstanceOf(DeepgramError);

    // Clean up spy
    jest.restoreAllMocks();
  });

  it("should re-throw non-DeepgramError", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const readClient = new ReadRestClient({ key: apiKey });

    // Mock the post method to throw a regular Error
    const mockError = new Error("Network error");
    jest.spyOn(readClient as any, "post").mockRejectedValue(mockError);

    await expect(
      readClient.analyzeText(testReadSources.simpleText, commonAnalysisOptions)
    ).rejects.toThrow("Network error");
    await expect(
      readClient.analyzeText(testReadSources.simpleText, commonAnalysisOptions)
    ).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
