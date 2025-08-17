import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, usageFieldsOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectUsageFieldsResponse } from "../../src/lib/types";

describe("manage getProjectUsageFields E2E", () => {
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

  it("should retrieve usage fields for a specific project with basic options", async () => {
    const response: DeepgramResponse<GetProjectUsageFieldsResponse> =
      await deepgram.manage.getProjectUsageFields(testProjectIds.primary, usageFieldsOptions.basic);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("tags");
      expect(response.result).toHaveProperty("models");
      expect(response.result).toHaveProperty("processing_methods");
      expect(response.result).toHaveProperty("languages");
      expect(response.result).toHaveProperty("features");

      expect(Array.isArray(response.result.tags)).toBe(true);
      expect(Array.isArray(response.result.models)).toBe(true);
      expect(Array.isArray(response.result.processing_methods)).toBe(true);
      expect(Array.isArray(response.result.languages)).toBe(true);
      expect(Array.isArray(response.result.features)).toBe(true);
    }

    expect(response).toMatchSnapshot("manage-getProjectUsageFields-response-structure");
  });

  it("should handle usage fields with filters", async () => {
    const response: DeepgramResponse<GetProjectUsageFieldsResponse> =
      await deepgram.manage.getProjectUsageFields(
        testProjectIds.primary,
        usageFieldsOptions.withFilters
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.tags).toBeDefined();
      expect(Array.isArray(response.result.tags)).toBe(true);
    }
  });

  it("should handle custom endpoint for getProjectUsageFields", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/usage/fields`;
    const response: DeepgramResponse<GetProjectUsageFieldsResponse> =
      await deepgram.manage.getProjectUsageFields(
        testProjectIds.primary,
        usageFieldsOptions.basic,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.tags).toBeDefined();
      expect(Array.isArray(response.result.tags)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
