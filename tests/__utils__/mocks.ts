/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, no-console */
import { mockTranscribeUrlResponse } from "../e2e/__mocks__/transcribe-url";
import { mockTranscribeFileResponse } from "../e2e/__mocks__/transcribe-file";
import { mockAudioBuffer, mockTTSHeaders } from "../e2e/__mocks__/speak-rest";

// Store original fetch to restore later
let originalFetch: typeof global.fetch | undefined;
let originalCrossFetch: any;

/**
 * Determines if we're in snapshot update mode
 */
function isUpdatingSnapshots(): boolean {
  const isUpdateMode =
    process.argv.includes("--updateSnapshot") ||
    process.argv.includes("-u") ||
    process.env.DEEPGRAM_FORCE_REAL_API === "true";

  if (isUpdateMode) {
    console.log(
      "🔍 Detected snapshot update mode - arguments:",
      process.argv.filter((arg) => arg.includes("update") || arg === "-u")
    );
  }

  return isUpdateMode;
}

/**
 * Creates a mock fetch function that handles Deepgram API requests
 */
function createMockFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method || "GET";

    console.log("🎭 Mock fetch intercepted:", method, url);

    // Mock Deepgram API endpoints
    if (url.includes("api.deepgram.com")) {
      if (url.includes("/v1/listen") && method === "POST") {
        console.log("🎭 -> Mocking transcription request");

        // Check if it's a URL-based or file-based request
        const body = init?.body;
        let isUrlRequest = false;

        if (typeof body === "string") {
          try {
            const parsed = JSON.parse(body);
            isUrlRequest = parsed && parsed.url;
          } catch {
            // Not JSON
          }
        }

        const responseData = isUrlRequest ? mockTranscribeUrlResponse : mockTranscribeFileResponse;

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/v1/speak") && method === "POST") {
        console.log("🎭 -> Mocking TTS request");

        return new Response(mockAudioBuffer, {
          status: 200,
          headers: new Headers(mockTTSHeaders),
        });
      }
    }

    // If we get here, it's not a Deepgram API request we're mocking
    console.log("🎭 -> Unmocked request, throwing error to simulate offline");
    throw new Error(`Network request blocked in offline test mode: ${method} ${url}`);
  };
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

  console.log("🎭 Mock mode: Using custom fetch mocks");

  // Store original implementations
  originalFetch = global.fetch;

  // Try to mock cross-fetch as well
  try {
    const crossFetch = require("cross-fetch");
    originalCrossFetch = crossFetch.default || crossFetch;
  } catch (_e) {
    // cross-fetch might not be available or loaded yet
  }

  // Create our mock fetch
  const mockFetch = createMockFetch();

  // Override global fetch
  global.fetch = mockFetch as any;

  // Also try to override cross-fetch
  try {
    const crossFetch = require("cross-fetch");
    if (crossFetch.default) {
      crossFetch.default = mockFetch;
    } else {
      Object.assign(crossFetch, mockFetch);
    }
  } catch (_e) {
    // Might not be available
  }

  console.log("🎭 Custom fetch mocks setup complete");
}

/**
 * Cleans up all mocks after tests
 */
export function cleanupApiMocks(): void {
  // Restore original fetch
  if (originalFetch) {
    global.fetch = originalFetch;
    originalFetch = undefined;
  }

  // Restore cross-fetch if we mocked it
  if (originalCrossFetch) {
    try {
      const crossFetch = require("cross-fetch");
      if (crossFetch.default) {
        crossFetch.default = originalCrossFetch;
      } else {
        Object.assign(crossFetch, originalCrossFetch);
      }
      originalCrossFetch = undefined;
    } catch (_e) {
      // Might not be available
    }
  }

  console.log("🎭 Custom fetch mocks cleaned up");
}
