import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { callbackUrls, testAudioFiles, transcriptionOptions } from "../__fixtures__/listen";
import type { DeepgramResponse, AsyncPrerecordedResponse } from "../../src/lib/types";
import { CallbackUrl } from "../../src/lib/helpers";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("listen transcribeFileCallback E2E", () => {
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

  it("should transcribe file with callback and return async response", async () => {
    const audioFile = readFileSync(
      resolve(__dirname, "..", "__fixtures__", testAudioFiles.spacewalk)
    );

    const response: DeepgramResponse<AsyncPrerecordedResponse> =
      await deepgram.listen.prerecorded.transcribeFileCallback(
        audioFile,
        new CallbackUrl(callbackUrls.webhook),
        transcriptionOptions.basic
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result).toHaveProperty("request_id");
      expect(typeof response.result.request_id).toBe("string");
      expect(response.result.request_id.length).toBeGreaterThan(0);
    }

    expect(response).toMatchSnapshot("listen-transcribe-file-callback-response-structure");
  });

  it("should handle enhanced options with callback", async () => {
    const audioFile = readFileSync(
      resolve(__dirname, "..", "__fixtures__", testAudioFiles.spacewalk)
    );

    const response: DeepgramResponse<AsyncPrerecordedResponse> =
      await deepgram.listen.prerecorded.transcribeFileCallback(
        audioFile,
        new CallbackUrl(callbackUrls.testEndpoint),
        transcriptionOptions.enhanced
      );

    expect(response.error).toBeNull();
    expect(response.result).toBeDefined();

    if (response.result) {
      expect(response.result.request_id).toBeDefined();
      expect(typeof response.result.request_id).toBe("string");
    }
  }, 30000); // 30 second timeout for API call
});
