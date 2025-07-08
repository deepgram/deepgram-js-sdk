import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, usageSummaryOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectUsageSummaryResponse } from "../../src/lib/types";

describe("manage getProjectUsageSummary E2E", () => {
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

  it("should retrieve usage summary for a specific project with basic options", async () => {
    const response: DeepgramResponse<GetProjectUsageSummaryResponse> =
      await deepgram.manage.getProjectUsageSummary(
        testProjectIds.primary,
        usageSummaryOptions.basic
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("start");
      expect(response.result).toHaveProperty("end");
      expect(response.result).toHaveProperty("resolution");
      expect(response.result).toHaveProperty("results");

      expect(typeof response.result.start).toBe("string");
      expect(typeof response.result.end).toBe("string");
      expect(Array.isArray(response.result.results)).toBe(true);

      // Verify result structure if any results exist
      if (response.result.results.length > 0) {
        const result = response.result.results[0];
        expect(result).toHaveProperty("start");
        expect(result).toHaveProperty("end");
        expect(result).toHaveProperty("hours");
        expect(result).toHaveProperty("requests");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectUsageSummary-response-structure");
  });

  it("should handle usage summary with filters", async () => {
    const response: DeepgramResponse<GetProjectUsageSummaryResponse> =
      await deepgram.manage.getProjectUsageSummary(
        testProjectIds.primary,
        usageSummaryOptions.withFilters
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.results).toBeDefined();
      expect(Array.isArray(response.result.results)).toBe(true);
    }
  });

  it("should handle custom endpoint for getProjectUsageSummary", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/usage`;
    const response: DeepgramResponse<GetProjectUsageSummaryResponse> =
      await deepgram.manage.getProjectUsageSummary(
        testProjectIds.primary,
        usageSummaryOptions.basic,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.results).toBeDefined();
      expect(Array.isArray(response.result.results)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
