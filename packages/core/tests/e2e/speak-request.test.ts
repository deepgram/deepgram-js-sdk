import { createClient } from "../../src/index";
import { SpeakRestClient } from "../../src/packages/SpeakRestClient";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testTextSources, commonTTSOptions } from "../__fixtures__/speak";

describe("speak request E2E", () => {
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

  it("should generate speech from text and return audio data", async () => {
    const speakClient = await deepgram.speak.request(testTextSources.greeting, commonTTSOptions);

    // Verify we got a response
    expect(speakClient).toBeTruthy();
    expect(speakClient.result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!speakClient.result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Verify the response structure
    expect(speakClient.result.ok).toBe(true);
    expect(speakClient.result.status).toBe(200);

    // Verify we can get the audio stream
    const audioStream = await speakClient.getStream();
    expect(audioStream).toBeTruthy();

    // Verify headers contain expected TTS metadata
    const headers = await speakClient.getHeaders();
    expect(headers).toBeTruthy();
    expect(headers.get("content-type")).toContain("audio/");

    // Check for Deepgram-specific headers (if present)
    const contentLength = headers.get("content-length");
    if (contentLength) {
      expect(parseInt(contentLength)).toBeGreaterThan(0);
    }

    // Test the structure with snapshot
    const headerObj = Object.fromEntries(headers.entries());
    expect(headerObj).toMatchSnapshot("speak-request-response-headers");

    // Verify audio stream is readable
    expect(audioStream).toBeInstanceOf(ReadableStream);
  }, 30000); // 30 second timeout for API call

  it("should handle different TTS options", async () => {
    const speakClient = await deepgram.speak.request(testTextSources.longText, {
      model: "aura-2-thalia-en",
      encoding: "linear16",
      sample_rate: 48000,
    });

    // Verify we got a response with the configured options
    expect(speakClient).toBeTruthy();
    expect(speakClient.result).toBeTruthy();

    if (!speakClient.result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    expect(speakClient.result.ok).toBe(true);
    expect(speakClient.result.status).toBe(200);

    // Verify audio stream is available
    const audioStream = await speakClient.getStream();
    expect(audioStream).toBeTruthy();
    expect(audioStream).toBeInstanceOf(ReadableStream);

    // Verify headers
    const headers = await speakClient.getHeaders();
    expect(headers).toBeTruthy();
    expect(headers.get("content-type")).toBeTruthy();
  }, 30000);

  it("should handle multiline text input", async () => {
    const speakClient = await deepgram.speak.request(testTextSources.multiline, commonTTSOptions);

    // Verify we got a response
    expect(speakClient).toBeTruthy();
    expect(speakClient.result).toBeTruthy();

    if (!speakClient.result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    expect(speakClient.result.ok).toBe(true);

    // Verify we can access the audio data
    const audioStream = await speakClient.getStream();
    expect(audioStream).toBeTruthy();

    const headers = await speakClient.getHeaders();
    expect(headers).toBeTruthy();
    expect(headers.get("content-type")).toContain("audio/");
  }, 30000);

  it("should reject empty text source", async () => {
    // Empty text should be rejected by the client validation
    await expect(deepgram.speak.request({ text: "" }, commonTTSOptions)).rejects.toThrow(
      "Unknown transcription source type"
    );
  }, 30000);

  it("should handle various audio encodings", async () => {
    const encodingTests = [
      { encoding: "mp3" as const },
      { encoding: "linear16" as const, sample_rate: 48000 },
      { encoding: "opus" as const },
    ];

    for (const options of encodingTests) {
      const speakClient = await deepgram.speak.request(
        { text: "Testing encoding: " + options.encoding },
        {
          model: "aura-2-thalia-en",
          ...options,
        }
      );

      expect(speakClient).toBeTruthy();
      expect(speakClient.result).toBeTruthy();

      if (!speakClient.result) {
        throw new Error("Result should not be null after toBeTruthy check");
      }

      expect(speakClient.result.ok).toBe(true);

      const audioStream = await speakClient.getStream();
      expect(audioStream).toBeTruthy();
    }
  }, 30000);

  it("should preserve special characters and punctuation", async () => {
    const specialTextSource = {
      text: "Hello! How are you? I'm fine. Testing 123, $50.00, and émojis 🎵",
    };

    const speakClient = await deepgram.speak.request(specialTextSource, commonTTSOptions);

    expect(speakClient).toBeTruthy();
    expect(speakClient.result).toBeTruthy();

    if (!speakClient.result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    expect(speakClient.result.ok).toBe(true);

    const audioStream = await speakClient.getStream();
    expect(audioStream).toBeTruthy();

    const headers = await speakClient.getHeaders();
    expect(headers).toBeTruthy();
    expect(headers.get("content-type")).toContain("audio/");
  }, 30000);

  it("should throw error when trying to getStream before making a request", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const speakClient = new SpeakRestClient({ key: apiKey });

    await expect(speakClient.getStream()).rejects.toThrow(
      "Tried to get stream before making request"
    );
  });

  it("should throw error when trying to getHeaders before making a request", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const speakClient = new SpeakRestClient({ key: apiKey });

    await expect(speakClient.getHeaders()).rejects.toThrow(
      "Tried to get headers before making request"
    );
  });
});
