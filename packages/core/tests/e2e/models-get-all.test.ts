import { createClient } from "../../src/index";
import { ModelsRestClient } from "../../src/packages/ModelsRestClient";
import { DeepgramError } from "../../src/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";

describe("models getAll E2E", () => {
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

  it("should retrieve all available models", async () => {
    const { result, error } = await deepgram.models.getAll();

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("models-getAll-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("stt");
    expect(result).toHaveProperty("tts");
    expect(Array.isArray(result.stt)).toBe(true);
    expect(Array.isArray(result.tts)).toBe(true);

    // Verify STT models have required properties
    if (result.stt.length > 0) {
      const sttModel = result.stt[0];
      expect(sttModel).toHaveProperty("name");
      expect(sttModel).toHaveProperty("canonical_name");
      expect(sttModel).toHaveProperty("architecture");
      expect(sttModel).toHaveProperty("languages");
      expect(sttModel).toHaveProperty("uuid");
      expect(Array.isArray(sttModel.languages)).toBe(true);
    }

    // Verify TTS models have required properties
    if (result.tts.length > 0) {
      const ttsModel = result.tts[0];
      expect(ttsModel).toHaveProperty("name");
      expect(ttsModel).toHaveProperty("canonical_name");
      expect(ttsModel).toHaveProperty("architecture");
      expect(ttsModel).toHaveProperty("languages");
      expect(ttsModel).toHaveProperty("uuid");
      expect(Array.isArray(ttsModel.languages)).toBe(true);
    }
  }, 30000);

  it("should handle model options and filters", async () => {
    const options = {
      include_outdated: false,
    };

    const { result, error } = await deepgram.models.getAll(":version/models", options);

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Verify the request was successful
    expect(result).toHaveProperty("stt");
    expect(result).toHaveProperty("tts");
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const modelsClient = new ModelsRestClient({ key: apiKey });

    // Mock the get method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(modelsClient as any, "get").mockRejectedValue(mockError);

    const { result, error } = await modelsClient.getAll();

    expect(result).toBeNull();
    expect(error).toBe(mockError);
    expect(error).toBeInstanceOf(DeepgramError);

    // Clean up spy
    jest.restoreAllMocks();
  });

  it("should re-throw non-DeepgramError", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const modelsClient = new ModelsRestClient({ key: apiKey });

    // Mock the get method to throw a regular Error
    const mockError = new Error("Network error");
    jest.spyOn(modelsClient as any, "get").mockRejectedValue(mockError);

    await expect(modelsClient.getAll()).rejects.toThrow("Network error");
    await expect(modelsClient.getAll()).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
