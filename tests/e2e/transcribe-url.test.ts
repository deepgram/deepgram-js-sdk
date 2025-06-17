import { createClient } from "../../src/index";

/**
 * Simple serializer that replaces values with type placeholders for non-deterministic testing
 */
const structureOnlySerializer = {
  test: (val: any) => val != null && typeof val === "object",
  serialize: (val: any) => {
    const replaceValues = (obj: any): any => {
      if (obj === null) return null;
      if (obj === undefined) return undefined;
      if (typeof obj === "string") return "<string>";
      if (typeof obj === "number") return "<number>";
      if (typeof obj === "boolean") return "<boolean>";

      if (Array.isArray(obj)) {
        return obj.length > 0 ? [replaceValues(obj[0])] : [];
      }

      if (typeof obj === "object") {
        const result: any = {};
        for (const key of Object.keys(obj).sort()) {
          result[key] = replaceValues(obj[key]);
        }
        return result;
      }

      return obj;
    };

    return JSON.stringify(replaceValues(val), null, 2);
  },
};

describe("transcribeUrl E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    // Ensure we have an API key from .env
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error("DEEPGRAM_API_KEY must be set in .env file for e2e tests");
    }

    deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    // Add our custom serializer
    expect.addSnapshotSerializer(structureOnlySerializer);
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
