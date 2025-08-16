import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testMemberIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectMemberScopesResponse } from "../../src/core/lib/types";

describe("manage getProjectMemberScopes E2E", () => {
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

  it("should retrieve member scopes for a specific project member", async () => {
    const response: DeepgramResponse<GetProjectMemberScopesResponse> =
      await deepgram.manage.getProjectMemberScopes(testProjectIds.primary, testMemberIds.member1);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("scopes");
      expect(Array.isArray(response.result.scopes)).toBe(true);

      // Verify scope values if any scopes exist
      if (response.result.scopes.length > 0) {
        response.result.scopes.forEach((scope) => {
          expect(typeof scope).toBe("string");
        });
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectMemberScopes-response-structure");
  });

  it("should handle custom endpoint for getProjectMemberScopes", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/members/${testMemberIds.member1}/scopes`;
    const response: DeepgramResponse<GetProjectMemberScopesResponse> =
      await deepgram.manage.getProjectMemberScopes(
        testProjectIds.primary,
        testMemberIds.member1,
        customEndpoint
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.scopes).toBeDefined();
      expect(Array.isArray(response.result.scopes)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
