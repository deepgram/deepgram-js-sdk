import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectKeysResponse } from "../../src/core/lib/types";

describe("manage getProjectKeys E2E", () => {
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

  it("should retrieve all project keys for a specific project", async () => {
    const response: DeepgramResponse<GetProjectKeysResponse> = await deepgram.manage.getProjectKeys(
      testProjectIds.primary
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_keys");
      expect(Array.isArray(response.result.api_keys)).toBe(true);

      // Verify key structure if any keys exist
      if (response.result.api_keys.length > 0) {
        const key = response.result.api_keys[0];
        expect(key).toHaveProperty("member");
        expect(key).toHaveProperty("api_key");

        expect(key.member).toHaveProperty("member_id");
        expect(key.member).toHaveProperty("email");

        expect(key.api_key).toHaveProperty("api_key_id");
        expect(key.api_key).toHaveProperty("comment");
        expect(key.api_key).toHaveProperty("scopes");
        expect(key.api_key).toHaveProperty("created");

        expect(Array.isArray(key.api_key.scopes)).toBe(true);
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectKeys-response-structure");
  });

  it("should handle custom endpoint for getProjectKeys", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/keys`;
    const response: DeepgramResponse<GetProjectKeysResponse> = await deepgram.manage.getProjectKeys(
      testProjectIds.primary,
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.api_keys).toBeDefined();
      expect(Array.isArray(response.result.api_keys)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
