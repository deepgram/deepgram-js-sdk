import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import type { DeepgramResponse, GetTokenDetailsResponse } from "../../src/lib/types";

describe("manage getTokenDetails E2E", () => {
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

  it("should retrieve token details for the authenticated user", async () => {
    const response: DeepgramResponse<GetTokenDetailsResponse> =
      await deepgram.manage.getTokenDetails();

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("scopes");
      expect(response.result).toHaveProperty("created");

      expect(typeof response.result.api_key_id).toBe("string");
      expect(Array.isArray(response.result.scopes)).toBe(true);
      expect(typeof response.result.created).toBe("string");
    }

    expect(response).toMatchSnapshot("manage-getTokenDetails-response-structure");
  });

  it("should handle custom endpoint for getTokenDetails", async () => {
    const customEndpoint = ":version/auth/token";
    const response: DeepgramResponse<GetTokenDetailsResponse> =
      await deepgram.manage.getTokenDetails(customEndpoint);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("scopes");
    }
  }, 30000); // 30 second timeout for API call
});
