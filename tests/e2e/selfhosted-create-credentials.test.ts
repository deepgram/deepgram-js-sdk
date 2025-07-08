import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testCredentials } from "../__fixtures__/selfhosted";

describe("selfhosted createCredentials E2E", () => {
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

  it("should create new self-hosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.createCredentials(
      testProjectIds.primary,
      testCredentials.createOptions
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("selfhosted-createCredentials-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("member");
    expect(result).toHaveProperty("distribution_credentials");

    const credData = result.distribution_credentials;
    expect(credData).toHaveProperty("distribution_credentials_id");
    expect(credData).toHaveProperty("comment");
    expect(credData).toHaveProperty("scopes");
    expect(credData).toHaveProperty("provider");
    expect(credData).toHaveProperty("created");

    // Verify the created credentials match our input
    expect(credData.comment).toBe(testCredentials.createOptions.comment);
    expect(credData.scopes).toEqual(testCredentials.createOptions.scopes);
  }, 30000);
});
