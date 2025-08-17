import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testCredentials } from "../__fixtures__/selfhosted";

describe("selfhosted deleteCredentials E2E", () => {
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

  it("should delete self-hosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.deleteCredentials(
      testProjectIds.primary,
      testCredentials.credentialId
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("selfhosted-deleteCredentials-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  }, 30000);
});
