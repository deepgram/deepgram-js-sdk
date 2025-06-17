import nock from "nock";
import { mockTranscribeUrlResponse } from "../e2e/__mocks__/transcribe-url";
import { mockTranscribeFileResponse } from "../e2e/__mocks__/transcribe-file";

/**
 * Determines if we're in snapshot update mode
 */
function isUpdatingSnapshots(): boolean {
  return process.argv.includes("--updateSnapshot") || process.argv.includes("-u");
}

/**
 * Sets up API mocks for e2e tests when not updating snapshots
 * This allows tests to run without internet/API key requirements
 */
export function setupApiMocks(): void {
  // Only mock if we're NOT updating snapshots
  if (isUpdatingSnapshots()) {
    console.log("📸 Snapshot update mode: Using real API calls");
    return;
  }

  console.log("🎭 Mock mode: Using nock interceptors");

  // Mock the Deepgram API base URL
  const deepgramApi = nock("https://api.deepgram.com")
    .persist() // Keep mocks active for multiple requests
    .defaultReplyHeaders({
      "content-type": "application/json",
    });

  // Mock transcribeUrl endpoint (POST with JSON body containing URL)
  deepgramApi
    .post("/v1/listen")
    .query(true) // Accept any query parameters
    .reply(function (uri, requestBody) {
      // Check if request body contains a URL (transcribeUrl) vs binary data (transcribeFile)
      if (typeof requestBody === "string" && requestBody.includes("url")) {
        return [200, mockTranscribeUrlResponse];
      }
      // For transcribeFile, the body will be binary data
      return [200, mockTranscribeFileResponse];
    });
}

/**
 * Cleans up all nock interceptors after tests
 */
export function cleanupApiMocks(): void {
  nock.cleanAll();
}
