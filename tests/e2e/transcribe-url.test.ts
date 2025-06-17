import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";

describe("transcribeUrl E2E", () => {
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

  it("should transcribe audio from URL and match expected response structure", async () => {
    const testUrl = "https://dpgr.am/spacewalk.wav";

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: testUrl },
      {
        model: "nova-3",
        smart_format: true,
        punctuate: true,
      }
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot (using custom serializer for non-deterministic content)
    expect(result).toMatchSnapshot("transcribeUrl-response-structure");

    // Essential structural validation - verify we have the required properties
    expect(result.metadata).toBeDefined();
    expect(result.results).toBeDefined();
    expect(Array.isArray(result.results.channels)).toBe(true);
    expect(result.results.channels.length).toBeGreaterThan(0);

    // Verify we got actual transcription content
    const transcript = result.results.channels[0]?.alternatives?.[0]?.transcript;
    expect(transcript).toBeTruthy();
    expect(typeof transcript).toBe("string");
    expect(transcript.length).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for API call
});
