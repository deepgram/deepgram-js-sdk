import { createClient } from "../../src/index";
import { ReadRestClient } from "../../src/core/packages/ReadRestClient";
import { DeepgramError } from "../../src/core/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testReadSources, commonAnalysisOptions } from "../__fixtures__/read";

describe("read analyzeUrl E2E", () => {
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

  it("should analyze URL source synchronously", async () => {
    const { result, error } = await deepgram.read.analyzeUrl(
      testReadSources.urlSource,
      commonAnalysisOptions
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("read-analyzeUrl-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("metadata");
    expect(result).toHaveProperty("results");

    expect(result.metadata).toHaveProperty("request_id");
    expect(typeof result.metadata.request_id).toBe("string");

    // Verify analysis results are present
    expect(result.results).toBeTruthy();
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const readClient = new ReadRestClient({ key: apiKey });

    // Mock the post method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(readClient as any, "post").mockRejectedValue(mockError);

    const { result, error } = await readClient.analyzeUrl(
      testReadSources.urlSource,
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
      readClient.analyzeUrl(testReadSources.urlSource, commonAnalysisOptions)
    ).rejects.toThrow("Network error");
    await expect(
      readClient.analyzeUrl(testReadSources.urlSource, commonAnalysisOptions)
    ).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
