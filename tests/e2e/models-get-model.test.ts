import { createClient } from "../../src/index";
import { ModelsRestClient } from "../../src/core/packages/ModelsRestClient";
import { DeepgramError } from "../../src/core/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testModelIds } from "../__fixtures__/models";

describe("models getModel E2E", () => {
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

  it("should retrieve specific model information", async () => {
    const { result, error } = await deepgram.models.getModel(testModelIds.nova);

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("models-getModel-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("canonical_name");
    expect(result).toHaveProperty("architecture");
    expect(result).toHaveProperty("languages");
    expect(result).toHaveProperty("uuid");
    expect(result).toHaveProperty("version");

    // Verify data types
    expect(typeof result.name).toBe("string");
    expect(typeof result.canonical_name).toBe("string");
    expect(typeof result.architecture).toBe("string");
    expect(Array.isArray(result.languages)).toBe(true);
    expect(typeof result.uuid).toBe("string");
    expect(typeof result.version).toBe("string");

    // Verify languages array contains strings
    if (result.languages) {
      result.languages.forEach((lang) => {
        expect(typeof lang).toBe("string");
      });
    }
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const modelsClient = new ModelsRestClient({ key: apiKey });

    // Mock the get method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(modelsClient as any, "get").mockRejectedValue(mockError);

    const { result, error } = await modelsClient.getModel(testModelIds.nova);

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

    await expect(modelsClient.getModel(testModelIds.nova)).rejects.toThrow("Network error");
    await expect(modelsClient.getModel(testModelIds.nova)).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
