import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testKeyIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectKeyResponse } from "../../src/lib/types";

describe("manage getProjectKey E2E", () => {
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

  it("should retrieve a specific project key by ID", async () => {
    const response: DeepgramResponse<GetProjectKeyResponse> = await deepgram.manage.getProjectKey(
      testProjectIds.primary,
      testKeyIds.key1
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("member");
      expect(response.result).toHaveProperty("api_key");

      expect(response.result.member).toHaveProperty("member_id");
      expect(response.result.member).toHaveProperty("email");

      expect(response.result.api_key).toHaveProperty("api_key_id");
      expect(response.result.api_key).toHaveProperty("comment");
      expect(response.result.api_key).toHaveProperty("scopes");
      expect(response.result.api_key).toHaveProperty("created");

      expect(Array.isArray(response.result.api_key.scopes)).toBe(true);
    }

    expect(response).toMatchSnapshot("manage-getProjectKey-response-structure");
  });

  it("should handle custom endpoint for getProjectKey", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/keys/${testKeyIds.key1}`;
    const response: DeepgramResponse<GetProjectKeyResponse> = await deepgram.manage.getProjectKey(
      testProjectIds.primary,
      testKeyIds.key1,
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("member");
      expect(response.result).toHaveProperty("api_key");
    }
  }, 30000); // 30 second timeout for API call
});
