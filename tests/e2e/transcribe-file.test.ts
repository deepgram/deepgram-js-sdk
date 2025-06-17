import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testAudioFiles, commonTranscriptionOptions } from "../__fixtures__/e2e-requests";
import * as fs from "fs";
import * as path from "path";

describe("transcribeFile E2E", () => {
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

  it("should transcribe audio from file and match expected response structure", async () => {
    const audioFilePath = path.join(__dirname, "../__fixtures__", testAudioFiles.spacewalk);

    // Verify the test file exists
    expect(fs.existsSync(audioFilePath)).toBe(true);

    // Read the audio file
    const audioBuffer = fs.readFileSync(audioFilePath);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      commonTranscriptionOptions
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot (using custom serializer for non-deterministic content)
    expect(result).toMatchSnapshot("transcribeFile-response-structure");

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
