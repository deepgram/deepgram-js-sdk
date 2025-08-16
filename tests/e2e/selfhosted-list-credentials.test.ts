import { createClient } from "../../src/index";
import { SelfHostedRestClient } from "../../src/core/packages/SelfHostedRestClient";
import { DeepgramError } from "../../src/core/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/selfhosted";

describe("selfhosted listCredentials E2E", () => {
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

  it("should list self-hosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.listCredentials(testProjectIds.primary);

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("selfhosted-listCredentials-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("distribution_credentials");
    expect(Array.isArray(result.distribution_credentials)).toBe(true);

    // Verify credentials structure if any exist
    if (result.distribution_credentials.length > 0) {
      const credential = result.distribution_credentials[0];
      expect(credential).toHaveProperty("member");
      expect(credential).toHaveProperty("distribution_credentials");

      expect(credential.member).toHaveProperty("member_id");
      expect(credential.member).toHaveProperty("email");

      const credData = credential.distribution_credentials;
      expect(credData).toHaveProperty("distribution_credentials_id");
      expect(credData).toHaveProperty("comment");
      expect(credData).toHaveProperty("scopes");
      expect(credData).toHaveProperty("provider");
      expect(credData).toHaveProperty("created");

      expect(Array.isArray(credData.scopes)).toBe(true);
    }
  }, 30000);

  it("should handle different endpoint configurations", async () => {
    const customEndpoint = ":version/projects/:projectId/onprem/distribution/credentials";

    const { result, error } = await deepgram.selfhosted.listCredentials(
      testProjectIds.secondary,
      customEndpoint
    );

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Verify the request was successful
    expect(result).toHaveProperty("distribution_credentials");
    expect(Array.isArray(result.distribution_credentials)).toBe(true);
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const selfhostedClient = new SelfHostedRestClient({ key: apiKey });

    // Mock the get method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(selfhostedClient as any, "get").mockRejectedValue(mockError);

    const { result, error } = await selfhostedClient.listCredentials(testProjectIds.primary);

    expect(result).toBeNull();
    expect(error).toBe(mockError);
    expect(error).toBeInstanceOf(DeepgramError);

    // Clean up spy
    jest.restoreAllMocks();
  });

  it("should re-throw non-DeepgramError", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const selfhostedClient = new SelfHostedRestClient({ key: apiKey });

    // Mock the get method to throw a regular Error
    const mockError = new Error("Network error");
    jest.spyOn(selfhostedClient as any, "get").mockRejectedValue(mockError);

    await expect(selfhostedClient.listCredentials(testProjectIds.primary)).rejects.toThrow(
      "Network error"
    );
    await expect(selfhostedClient.listCredentials(testProjectIds.primary)).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
