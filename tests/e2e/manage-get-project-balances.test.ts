import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectBalancesResponse } from "../../src/lib/types";

describe("manage getProjectBalances E2E", () => {
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

  it("should retrieve all project balances for a specific project", async () => {
    const response: DeepgramResponse<GetProjectBalancesResponse> =
      await deepgram.manage.getProjectBalances(testProjectIds.primary);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("balances");
      expect(Array.isArray(response.result.balances)).toBe(true);

      // Verify balance structure if any balances exist
      if (response.result.balances.length > 0) {
        const balance = response.result.balances[0];
        expect(balance).toHaveProperty("balance_id");
        expect(balance).toHaveProperty("amount");
        expect(balance).toHaveProperty("units");
        expect(balance).toHaveProperty("purchase");

        expect(typeof balance.balance_id).toBe("string");
        expect(typeof balance.amount).toBe("number");
        expect(typeof balance.units).toBe("string");
        expect(typeof balance.purchase).toBe("string");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectBalances-response-structure");
  });

  it("should handle custom endpoint for getProjectBalances", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/balances`;
    const response: DeepgramResponse<GetProjectBalancesResponse> =
      await deepgram.manage.getProjectBalances(testProjectIds.primary, customEndpoint);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.balances).toBeDefined();
      expect(Array.isArray(response.result.balances)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
