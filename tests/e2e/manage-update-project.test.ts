import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, projectOptions } from "../__fixtures__/manage";
import type { DeepgramResponse, MessageResponse } from "../../src/core/lib/types";

describe("manage updateProject E2E", () => {
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

  it("should update a project with new details", async () => {
    const response: DeepgramResponse<MessageResponse> = await deepgram.manage.updateProject(
      testProjectIds.primary,
      projectOptions.update
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("message");
      expect(typeof response.result.message).toBe("string");
    }

    expect(response).toMatchSnapshot("manage-updateProject-response-structure");
  });

  it("should handle custom endpoint for updateProject", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}`;
    const response: DeepgramResponse<MessageResponse> = await deepgram.manage.updateProject(
      testProjectIds.primary,
      projectOptions.update,
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("message");
    }
  }, 30000); // 30 second timeout for API call
});
