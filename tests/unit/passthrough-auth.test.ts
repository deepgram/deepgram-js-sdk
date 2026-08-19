import type { Mock } from "vitest";
import { makePassthroughRequest } from "../../src/core/fetcher/makePassthroughRequest";

/**
 * Regression coverage for the passthrough auth origin gate.
 *
 * The 2026-08-19 regen added an origin check to `makePassthroughRequest` so the SDK stops
 * sending credentials to an arbitrary host passed into `client.fetch()`. That fix is right,
 * but the generator compares against the resolved base URL ONLY — and Deepgram serves REST
 * from two hosts (`base` = api.deepgram.com, `agentRest` = agent.deepgram.com). An absolute
 * URL to the agent host therefore lost its auth header and failed with an unexplained 401.
 *
 * `src/core/fetcher/makePassthroughRequest.ts` is frozen with a widened allowlist: the
 * caller's base URL plus every host in `DeepgramEnvironment`. These tests pin both halves —
 * first-party hosts keep their credentials, unrelated hosts still get none.
 */
describe("passthrough auth origin gate", () => {
    let mockFetch: Mock;
    const AUTH = { Authorization: "Bearer secret-token" };
    const getAuthHeaders = async () => AUTH;

    beforeEach(() => {
        mockFetch = vi.fn();
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    });

    const authHeaderFor = async (url: string, baseUrl?: string): Promise<string | undefined> => {
        await makePassthroughRequest(url, undefined, { baseUrl, getAuthHeaders, fetch: mockFetch });
        const [, calledOptions] = mockFetch.mock.calls[0];
        return calledOptions.headers.authorization;
    };

    it("authenticates a relative path against the default REST host", async () => {
        expect(await authHeaderFor("/v1/projects", "https://api.deepgram.com")).toBe(AUTH.Authorization);
    });

    it("authenticates an absolute api.deepgram.com URL", async () => {
        expect(await authHeaderFor("https://api.deepgram.com/v1/projects", "https://api.deepgram.com")).toBe(
            AUTH.Authorization,
        );
    });

    it("authenticates an absolute agent.deepgram.com URL while based on api.deepgram.com", async () => {
        // The regression: agentRest is a first-party host, but it is not the resolved base
        // URL, so the generator's single-origin check silently dropped the auth header here.
        expect(await authHeaderFor("https://agent.deepgram.com/v1/agent", "https://api.deepgram.com")).toBe(
            AUTH.Authorization,
        );
    });

    it("does NOT authenticate an unrelated host", async () => {
        // The upstream fix this patch must preserve.
        expect(await authHeaderFor("https://evil.example.com/steal", "https://api.deepgram.com")).toBeUndefined();
    });

    it("does NOT authenticate a protocol downgrade to a first-party host", async () => {
        // `wss://agent.deepgram.com` is in DeepgramEnvironment, but origins include the
        // scheme, so an insecure http:// request to the same host must not pick up creds.
        expect(await authHeaderFor("http://agent.deepgram.com/v1/agent", "https://api.deepgram.com")).toBeUndefined();
    });

    it("still authenticates a custom base URL (self-hosted)", async () => {
        expect(await authHeaderFor("https://self-hosted.internal/v1/listen", "https://self-hosted.internal")).toBe(
            AUTH.Authorization,
        );
    });
});
