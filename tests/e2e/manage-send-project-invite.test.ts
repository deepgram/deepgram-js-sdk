import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, inviteOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, MessageResponse } from "../../src/core/lib/types";

describe("manage sendProjectInvite E2E", () => {
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

  it("should send a project invitation to a single email", async () => {
    const response: DeepgramResponse<MessageResponse> = await deepgram.manage.sendProjectInvite(
      testProjectIds.primary,
      inviteOptions.single
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("message");
      expect(typeof response.result.message).toBe("string");
    }

    expect(response).toMatchSnapshot("manage-sendProjectInvite-response-structure");
  });

  it("should send project invitations to multiple emails", async () => {
    const response: DeepgramResponse<MessageResponse> = await deepgram.manage.sendProjectInvite(
      testProjectIds.primary,
      inviteOptions.multiple
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("message");
    }
  });

  it("should handle custom endpoint for sendProjectInvite", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}/invites`;
    const response: DeepgramResponse<MessageResponse> = await deepgram.manage.sendProjectInvite(
      testProjectIds.primary,
      inviteOptions.single,
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();
  }, 30000); // 30 second timeout for API call
});
