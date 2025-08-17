import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectMembersResponse } from "../../src/lib/types";

describe("manage getProjectMembers E2E", () => {
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

  it("should retrieve all project members for a specific project", async () => {
    const response: DeepgramResponse<GetProjectMembersResponse> =
      await deepgram.manage.getProjectMembers(testProjectIds.primary);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("members");
      expect(Array.isArray(response.result.members)).toBe(true);

      // Verify member structure if any members exist
      if (response.result.members.length > 0) {
        const member = response.result.members[0];
        expect(member).toHaveProperty("member_id");
        expect(member).toHaveProperty("email");
        expect(member).toHaveProperty("first_name");
        expect(member).toHaveProperty("last_name");
        expect(member).toHaveProperty("scopes");

        expect(typeof member.member_id).toBe("string");
        expect(typeof member.email).toBe("string");
        expect(Array.isArray(member.scopes)).toBe(true);
      }
    }

    expect(response).toMatchSnapshot("manage-getProjectMembers-response-structure");
  });

  it("should handle custom endpoint for getProjectMembers", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/members`;
    const response: DeepgramResponse<GetProjectMembersResponse> =
      await deepgram.manage.getProjectMembers(testProjectIds.primary, customEndpoint);

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.members).toBeDefined();
      expect(Array.isArray(response.result.members)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
