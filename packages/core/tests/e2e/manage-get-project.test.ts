import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";
import type { DeepgramResponse, GetProjectResponse } from "../../src/lib/types";

describe("manage getProject E2E", () => {
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

  it("should retrieve a specific project by ID", async () => {
    const response: DeepgramResponse<GetProjectResponse> = await deepgram.manage.getProject(
      testProjectIds.primary
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("project_id");
      expect(response.result).toHaveProperty("name");
      expect(response.result).toHaveProperty("company");
      expect(typeof response.result.project_id).toBe("string");
      expect(typeof response.result.name).toBe("string");
      expect(typeof response.result.company).toBe("string");
    }

    expect(response).toMatchSnapshot("manage-getProject-response-structure");
  });

  it("should handle custom endpoint for getProject", async () => {
    const customEndpoint = `:version/projects/${testProjectIds.primary}`;
    const response: DeepgramResponse<GetProjectResponse> = await deepgram.manage.getProject(
      testProjectIds.primary,
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("project_id");
      expect(response.result).toHaveProperty("name");
      expect(response.result).toHaveProperty("company");
    }
  }, 30000); // 30 second timeout for API call
});
