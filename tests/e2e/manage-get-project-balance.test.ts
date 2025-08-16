import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testBalanceIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectBalanceResponse } from "../../src/core/lib/types";

describe("manage getProjectBalance E2E", () => {
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

  it("should retrieve a specific project balance by ID", async () => {
    const response: DeepgramResponse<GetProjectBalanceResponse> =
      await deepgram.manage.getProjectBalance(testProjectIds.primary, testBalanceIds.balance1);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("balance_id");
      expect(response.result).toHaveProperty("amount");
      expect(response.result).toHaveProperty("units");
      expect(response.result).toHaveProperty("purchase");

      expect(typeof response.result.balance_id).toBe("string");
      expect(typeof response.result.amount).toBe("number");
      expect(typeof response.result.units).toBe("string");
      expect(typeof response.result.purchase).toBe("string");
    }

    expect(response).toMatchSnapshot("manage-getProjectBalance-response-structure");
  });

  it("should handle custom endpoint for getProjectBalance", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/balances/${testBalanceIds.balance1}`;
    const response: DeepgramResponse<GetProjectBalanceResponse> =
      await deepgram.manage.getProjectBalance(
        testProjectIds.primary,
        testBalanceIds.balance1,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("balance_id");
      expect(response.result).toHaveProperty("amount");
    }
  }, 30000); // 30 second timeout for API call
});
