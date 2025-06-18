/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, no-console */
import {
  mockTranscribeUrlResponse,
  mockTranscribeFileResponse,
  mockAsyncListenUrlResponse,
  mockAsyncListenFileResponse,
} from "../e2e/__mocks__/listen";
import { mockAudioBuffer, mockTTSHeaders } from "../e2e/__mocks__/speak";
import { mockGetAllModelsResponse, mockGetModelResponse } from "../e2e/__mocks__/models";
import { mockGrantTokenResponse } from "../e2e/__mocks__/auth";
import {
  mockAnalyzeTextResponse,
  mockAnalyzeUrlResponse,
  mockAsyncAnalyzeResponse,
  mockAsyncReadUrlResponse,
  mockAsyncReadTextResponse,
} from "../e2e/__mocks__/read";
import {
  mockListCredentialsResponse,
  mockGetCredentialsResponse,
  mockCreateCredentialsResponse,
  mockDeleteCredentialsResponse,
} from "../e2e/__mocks__/selfhosted";
import {
  mockGetProjectsResponse,
  mockGetProjectResponse,
  mockGetProjectKeysResponse,
  mockGetProjectKeyResponse,
  mockGetProjectMembersResponse,
  mockGetProjectBalancesResponse,
  mockGetProjectUsageRequestsResponse,
  mockGetProjectUsageSummaryResponse,
  mockCreateProjectKeyResponse,
  mockGetTokenDetailsResponse,
  mockDeleteProjectResponse,
  mockDeleteProjectKeyResponse,
  mockRemoveProjectMemberResponse,
  mockDeleteProjectInviteResponse,
  mockGetProjectMemberScopesResponse,
  mockUpdateProjectMemberScopeResponse,
  mockGetProjectInvitesResponse,
  mockSendProjectInviteResponse,
  mockLeaveProjectResponse,
  mockGetProjectUsageRequestResponse,
  mockGetProjectUsageFieldsResponse,
  mockGetProjectBalanceResponse,
  mockGetAllProjectModelsResponse,
  mockGetProjectModelResponse,
  mockUpdateProjectResponse,
} from "../e2e/__mocks__/manage";

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

        // Check if it's a callback request (async)
        const isCallbackRequest = url.includes("callback=");

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

        let responseData;
        if (isCallbackRequest) {
          responseData = isUrlRequest ? mockAsyncListenUrlResponse : mockAsyncListenFileResponse;
        } else {
          responseData = isUrlRequest ? mockTranscribeUrlResponse : mockTranscribeFileResponse;
        }

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

      if (url.includes("/v1/models") && method === "GET") {
        console.log("🎭 -> Mocking models request");

        // Check if it's a specific model request (has model ID in path)
        const modelIdMatch = url.match(/\/v1\/models\/([^?]+)/);
        const responseData = modelIdMatch ? mockGetModelResponse : mockGetAllModelsResponse;

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/v1/auth/grant") && method === "POST") {
        console.log("🎭 -> Mocking auth grant token request");

        return new Response(JSON.stringify(mockGrantTokenResponse), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/v1/read") && method === "POST") {
        console.log("🎭 -> Mocking read/analyze request");

        // Check if it's a callback request (async)
        const isCallbackRequest = url.includes("callback=");

        if (isCallbackRequest) {
          // Check if it's a URL-based or text-based request for callback
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

          const responseData = isUrlRequest ? mockAsyncReadUrlResponse : mockAsyncReadTextResponse;
          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check if it's a URL-based or text-based request
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

        const responseData = isUrlRequest ? mockAnalyzeUrlResponse : mockAnalyzeTextResponse;

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/onprem/distribution/credentials")) {
        console.log("🎭 -> Mocking self-hosted credentials request");

        if (method === "GET") {
          // Check if it's a specific credential request (has credential ID in path)
          const credentialIdMatch = url.match(/\/credentials\/([^?]+)$/);
          const responseData = credentialIdMatch
            ? mockGetCredentialsResponse
            : mockListCredentialsResponse;

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        if (method === "POST") {
          return new Response(JSON.stringify(mockCreateCredentialsResponse), {
            status: 201,
            headers: { "content-type": "application/json" },
          });
        }

        if (method === "DELETE") {
          return new Response(JSON.stringify(mockDeleteCredentialsResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (url.includes("/v1/auth/token") && method === "GET") {
        console.log("🎭 -> Mocking auth token details request");
        return new Response(JSON.stringify(mockGetTokenDetailsResponse), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/v1/projects") && method === "GET") {
        console.log("🎭 -> Mocking manage projects request");

        // Check for project keys endpoint
        if (url.includes("/keys")) {
          // Check if it's a specific key request (has key ID in path after /keys/)
          const keyIdMatch = url.match(/\/keys\/([^?/]+)$/);
          const responseData = keyIdMatch ? mockGetProjectKeyResponse : mockGetProjectKeysResponse;

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project members endpoint
        if (url.includes("/members")) {
          // Check for member scopes endpoint
          if (url.includes("/scopes")) {
            return new Response(JSON.stringify(mockGetProjectMemberScopesResponse), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          }
          return new Response(JSON.stringify(mockGetProjectMembersResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project balances endpoint
        if (url.includes("/balances")) {
          // Check if it's a specific balance request
          const balanceIdMatch = url.match(/\/balances\/([^?/]+)$/);
          const responseData = balanceIdMatch
            ? mockGetProjectBalanceResponse
            : mockGetProjectBalancesResponse;

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project invites endpoint
        if (url.includes("/invites")) {
          return new Response(JSON.stringify(mockGetProjectInvitesResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project usage requests endpoint
        if (url.includes("/requests")) {
          // Check if it's a specific request
          const requestIdMatch = url.match(/\/requests\/([^?/]+)$/);
          const responseData = requestIdMatch
            ? mockGetProjectUsageRequestResponse
            : mockGetProjectUsageRequestsResponse;

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project usage summary endpoint
        if (url.includes("/usage/fields")) {
          return new Response(JSON.stringify(mockGetProjectUsageFieldsResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project usage summary endpoint
        if (url.includes("/usage")) {
          return new Response(JSON.stringify(mockGetProjectUsageSummaryResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project models endpoint
        if (url.includes("/models")) {
          // Check if it's a specific model request
          const modelIdMatch = url.match(/\/models\/([^?/]+)$/);
          const responseData = modelIdMatch
            ? mockGetProjectModelResponse
            : mockGetAllProjectModelsResponse;

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check if it's a specific project request (has project ID in path)
        const projectIdMatch = url.match(/\/v1\/projects\/([^?/]+)$/);
        const responseData = projectIdMatch ? mockGetProjectResponse : mockGetProjectsResponse;

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/v1/projects") && method === "POST") {
        console.log("🎭 -> Mocking manage projects POST request");

        // Check for project key creation
        if (url.includes("/keys")) {
          return new Response(JSON.stringify(mockCreateProjectKeyResponse), {
            status: 201,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project invites
        if (url.includes("/invites")) {
          return new Response(JSON.stringify(mockSendProjectInviteResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (url.includes("/v1/projects") && method === "PATCH") {
        console.log("🎭 -> Mocking manage projects PATCH request");

        // Check for project updates
        if (url.match(/\/v1\/projects\/[^/]+$/)) {
          return new Response(JSON.stringify(mockUpdateProjectResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (url.includes("/v1/projects") && method === "PUT") {
        console.log("🎭 -> Mocking manage projects PUT request");

        // Check for member scope updates
        if (url.includes("/scopes")) {
          return new Response(JSON.stringify(mockUpdateProjectMemberScopeResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (url.includes("/v1/projects") && method === "DELETE") {
        console.log("🎭 -> Mocking manage projects DELETE request");

        // Check for leave project (special case - returns JSON response)
        if (url.includes("/leave")) {
          return new Response(JSON.stringify(mockLeaveProjectResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for project deletion
        if (url.match(/\/v1\/projects\/[^/]+$/)) {
          return new Response(JSON.stringify(mockDeleteProjectResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for key deletion
        if (url.includes("/keys/")) {
          return new Response(JSON.stringify(mockDeleteProjectKeyResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for member removal
        if (url.includes("/members/")) {
          return new Response(JSON.stringify(mockRemoveProjectMemberResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        // Check for invite deletion
        if (url.includes("/invites/")) {
          return new Response(JSON.stringify(mockDeleteProjectInviteResponse), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
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
