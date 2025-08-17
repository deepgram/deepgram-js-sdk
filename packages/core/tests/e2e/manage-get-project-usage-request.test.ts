import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testRequestIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectUsageRequestResponse } from "../../src/lib/types";

describe("manage getProjectUsageRequest E2E", () => {
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

  it("should retrieve a specific usage request by ID", async () => {
    const response: DeepgramResponse<GetProjectUsageRequestResponse> =
      await deepgram.manage.getProjectUsageRequest(testProjectIds.primary, testRequestIds.request1);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("request_id");
      expect(response.result).toHaveProperty("created");
      expect(response.result).toHaveProperty("path");
      expect(response.result).toHaveProperty("api_key_id");
      expect(response.result).toHaveProperty("response");

      expect(typeof response.result.request_id).toBe("string");
      expect(typeof response.result.created).toBe("string");
      expect(typeof response.result.path).toBe("string");
      expect(typeof response.result.api_key_id).toBe("string");
      expect(typeof response.result.response).toBe("object");

      // Verify response details
      if (response.result.response) {
        expect(response.result.response).toHaveProperty("code");
        expect(response.result.response).toHaveProperty("completed");
        expect(response.result.response).toHaveProperty("details");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectUsageRequest-response-structure");
  });

  it("should handle custom endpoint for getProjectUsageRequest", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/requests/${testRequestIds.request1}`;
    const response: DeepgramResponse<GetProjectUsageRequestResponse> =
      await deepgram.manage.getProjectUsageRequest(
        testProjectIds.primary,
        testRequestIds.request1,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("request_id");
      expect(response.result).toHaveProperty("path");
    }
  }, 30000); // 30 second timeout for API call
});
