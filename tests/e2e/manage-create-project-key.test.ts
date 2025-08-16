import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, keyOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, CreateProjectKeyResponse } from "../../src/core/lib/types";

describe("manage createProjectKey E2E", () => {
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

  it("should create a new API key for a specific project", async () => {
    const response: DeepgramResponse<CreateProjectKeyResponse> =
      await deepgram.manage.createProjectKey(testProjectIds.primary, keyOptions.create);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("key");
      expect(response.result).toHaveProperty("comment");
      expect(response.result).toHaveProperty("scopes");
      expect(response.result).toHaveProperty("created");

      expect(typeof response.result.api_key_id).toBe("string");
      expect(typeof response.result.key).toBe("string");
      expect(typeof response.result.comment).toBe("string");
      expect(typeof response.result.created).toBe("string");
      expect(Array.isArray(response.result.scopes)).toBe(true);

      // Verify the key has the correct format (starts with "ak_")
      expect(response.result.key).toMatch(/^ak_/);
    }

    expect(response).toMatchSnapshot("manage-createProjectKey-response-structure");
  });

  it("should create a minimal API key with just comment", async () => {
    const response: DeepgramResponse<CreateProjectKeyResponse> =
      await deepgram.manage.createProjectKey(testProjectIds.primary, keyOptions.createMinimal);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("key");
      expect(response.result).toHaveProperty("comment");
      expect(typeof response.result.comment).toBe("string");
    }
  });

  it("should handle custom endpoint for createProjectKey", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/keys`;
    const response: DeepgramResponse<CreateProjectKeyResponse> =
      await deepgram.manage.createProjectKey(
        testProjectIds.primary,
        keyOptions.create,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("key");
      expect(response.result.key).toMatch(/^ak_/);
    }
  }, 30000); // 30 second timeout for API call
});
