import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectInvitesResponse } from "../../src/core/lib/types";

describe("manage getProjectInvites E2E", () => {
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

  it("should retrieve all project invitations for a specific project", async () => {
    const response: DeepgramResponse<GetProjectInvitesResponse> =
      await deepgram.manage.getProjectInvites(testProjectIds.primary);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("invites");
      expect(Array.isArray(response.result.invites)).toBe(true);

      // Verify invite structure if any invites exist
      if (response.result.invites.length > 0) {
        const invite = response.result.invites[0];
        expect(invite).toHaveProperty("email");
        expect(invite).toHaveProperty("scope");

        expect(typeof invite.email).toBe("string");
        expect(typeof invite.scope).toBe("string");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectInvites-response-structure");
  });

  it("should handle custom endpoint for getProjectInvites", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/invites`;
    const response: DeepgramResponse<GetProjectInvitesResponse> =
      await deepgram.manage.getProjectInvites(testProjectIds.primary, customEndpoint);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.invites).toBeDefined();
      expect(Array.isArray(response.result.invites)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
