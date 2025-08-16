import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, usageRequestOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectUsageRequestsResponse } from "../../src/core/lib/types";

describe("manage getProjectUsageRequests E2E", () => {
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

  it("should retrieve usage requests for a specific project with basic options", async () => {
    const response: DeepgramResponse<GetProjectUsageRequestsResponse> =
      await deepgram.manage.getProjectUsageRequests(
        testProjectIds.primary,
        usageRequestOptions.basic
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("page");
      expect(response.result).toHaveProperty("limit");
      expect(response.result).toHaveProperty("requests");
      expect(Array.isArray(response.result.requests)).toBe(true);

      // Verify request structure if any requests exist
      if (response.result.requests.length > 0) {
        const request = response.result.requests[0];
        expect(request).toHaveProperty("request_id");
        expect(request).toHaveProperty("created");
        expect(request).toHaveProperty("path");
        expect(request).toHaveProperty("api_key_id");
        expect(request).toHaveProperty("response");

        expect(typeof request.request_id).toBe("string");
        expect(typeof request.created).toBe("string");
        expect(typeof request.path).toBe("string");
        expect(typeof request.api_key_id).toBe("string");
        expect(typeof request.response).toBe("object");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectUsageRequests-response-structure");
  });

  it("should handle usage requests with limit and pagination", async () => {
    const response: DeepgramResponse<GetProjectUsageRequestsResponse> =
      await deepgram.manage.getProjectUsageRequests(
        testProjectIds.primary,
        usageRequestOptions.withPagination
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.requests).toBeDefined();
      expect(Array.isArray(response.result.requests)).toBe(true);
      expect(typeof response.result.page).toBe("number");
      expect(typeof response.result.limit).toBe("number");
    }
  });

  it("should handle custom endpoint for getProjectUsageRequests", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/requests`;
    const response: DeepgramResponse<GetProjectUsageRequestsResponse> =
      await deepgram.manage.getProjectUsageRequests(
        testProjectIds.primary,
        usageRequestOptions.basic,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.requests).toBeDefined();
      expect(Array.isArray(response.result.requests)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
