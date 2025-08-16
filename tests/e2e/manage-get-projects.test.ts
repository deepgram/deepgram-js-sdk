import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import type { DeepgramResponse, GetProjectsResponse } from "../../src/core/lib/types";

describe("manage getProjects E2E", () => {
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

  it("should retrieve all projects for the authenticated user", async () => {
    const response: DeepgramResponse<GetProjectsResponse> = await deepgram.manage.getProjects();

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("projects");
      expect(Array.isArray(response.result.projects)).toBe(true);

      // Verify project structure if any projects exist
      if (response.result.projects.length > 0) {
        const project = response.result.projects[0];
        expect(project).toHaveProperty("project_id");
        expect(project).toHaveProperty("name");
        expect(typeof project.project_id).toBe("string");
        expect(typeof project.name).toBe("string");
      }
    }

    expect(response).toMatchSnapshot("manage-getProjects-response-structure");
  });

  it("should handle custom endpoint for getProjects", async () => {
    const customEndpoint = ":version/projects";
    const response: DeepgramResponse<GetProjectsResponse> = await deepgram.manage.getProjects(
      customEndpoint
    );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.projects).toBeDefined();
      expect(Array.isArray(response.result.projects)).toBe(true);
    }
  }, 30000); // 30 second timeout for API call
});
