import { createClient } from "../../src/index";
import { AuthRestClient } from "../../src/packages/AuthRestClient";
import { DeepgramError } from "../../src/lib/errors";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";

describe("auth grantToken E2E", () => {
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

  it("should generate a temporary access token", async () => {
    const { result, error } = await deepgram.auth.grantToken();

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    // Type guard to ensure result is not null for subsequent operations
    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Test the structure with snapshot
    expect(result).toMatchSnapshot("auth-grantToken-response-structure");

    // Essential structural validation
    expect(result).toHaveProperty("access_token");
    expect(result).toHaveProperty("expires_in");

    // Verify data types and format
    expect(typeof result.access_token).toBe("string");
    expect(typeof result.expires_in).toBe("number");

    // Verify access token is a non-empty string (should be JWT format in real API)
    expect(result.access_token.length).toBeGreaterThan(0);

    // Verify expires_in is a positive number (typically in seconds)
    expect(result.expires_in).toBeGreaterThan(0);
  }, 30000);

  it("should handle custom endpoint for token generation", async () => {
    const customEndpoint = ":version/auth/grant";
    const { result, error } = await deepgram.auth.grantToken(customEndpoint);

    // Verify no error occurred
    expect(error).toBeNull();
    expect(result).toBeTruthy();

    if (!result) {
      throw new Error("Result should not be null after toBeTruthy check");
    }

    // Verify the response structure is consistent
    expect(result).toHaveProperty("access_token");
    expect(result).toHaveProperty("expires_in");
    expect(typeof result.access_token).toBe("string");
    expect(typeof result.expires_in).toBe("number");
  }, 30000);

  it("should handle DeepgramError and return it in response", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const authClient = new AuthRestClient({ key: apiKey });

    // Mock the post method to throw a DeepgramError
    const mockError = new DeepgramError("Test DeepgramError");
    jest.spyOn(authClient as any, "post").mockRejectedValue(mockError);

    const { result, error } = await authClient.grantToken();

    expect(result).toBeNull();
    expect(error).toBe(mockError);
    expect(error).toBeInstanceOf(DeepgramError);

    // Clean up spy
    jest.restoreAllMocks();
  });

  it("should re-throw non-DeepgramError", async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    const authClient = new AuthRestClient({ key: apiKey });

    // Mock the post method to throw a regular Error
    const mockError = new Error("Network error");
    jest.spyOn(authClient as any, "post").mockRejectedValue(mockError);

    await expect(authClient.grantToken()).rejects.toThrow("Network error");
    await expect(authClient.grantToken()).rejects.toThrow(Error);

    // Clean up spy
    jest.restoreAllMocks();
  });
});
