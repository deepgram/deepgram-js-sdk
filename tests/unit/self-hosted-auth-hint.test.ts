import type { Mock } from "vitest";
import { DeepgramClient, DeepgramError } from "../../src";

/**
 * Self-hosted and local Deepgram servers can run without request authentication. Pointing the
 * client at one without a key used to fail with only the generated "Please provide 'apiKey'"
 * message, which gives the developer no way forward: there is no key to provide.
 *
 * `src/CustomClient.ts` appends a hint about `auth: false` to that error when the client's REST
 * base URL is not a Deepgram host. These tests pin both halves: the hint appears for other hosts,
 * and the hosted-API message stays exactly as generated.
 */
const MISSING_KEY = "Please provide 'apiKey' when initializing the client";
const LOCAL = "http://127.0.0.1:8000";

describe("missing-key error hint for self-hosted servers", () => {
    const saved: Record<string, string | undefined> = {};
    let mockFetch: Mock;

    beforeEach(() => {
        for (const name of ["DEEPGRAM_API_KEY", "DEEPGRAM_ACCESS_TOKEN"]) {
            saved[name] = process.env[name];
            delete process.env[name];
        }
        mockFetch = vi.fn().mockImplementation(async () => new Response(JSON.stringify({}), { status: 200 }));
    });

    afterEach(() => {
        for (const [name, value] of Object.entries(saved)) {
            if (value === undefined) {
                delete process.env[name];
            } else {
                process.env[name] = value;
            }
        }
    });

    const missingKeyError = async (options: ConstructorParameters<typeof DeepgramClient>[0]): Promise<unknown> => {
        const client = new DeepgramClient({ ...options, fetch: mockFetch, maxRetries: 0 });
        try {
            await client.manage.v1.models.list();
        } catch (error) {
            return error;
        }
        throw new Error("expected models.list() to reject");
    };

    const authHeaderSent = (): string | undefined => {
        const [, init] = mockFetch.mock.calls[0];
        const headers = new Headers(init?.headers as HeadersInit);
        return headers.get("authorization") ?? undefined;
    };

    it("adds the auth: false hint when baseUrl is a local server", async () => {
        const error = await missingKeyError({ baseUrl: LOCAL });
        expect(error).toBeInstanceOf(DeepgramError);
        expect((error as DeepgramError).message).toContain(MISSING_KEY);
        expect((error as DeepgramError).message).toContain("auth: false");
        expect((error as DeepgramError).message).toMatch(/environment variable\. If you are connecting/);
        expect((error as DeepgramError).cause).toBeInstanceOf(DeepgramError);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it("adds the hint when a custom environment's base is a self-hosted host", async () => {
        const error = await missingKeyError({
            environment: {
                base: "https://deepgram.internal.example.com",
                production: "wss://deepgram.internal.example.com",
                agent: "wss://deepgram.internal.example.com",
                agentRest: "https://deepgram.internal.example.com",
            },
        });
        expect((error as DeepgramError).message).toContain("auth: false");
    });

    it("keeps the generated message unchanged for the default hosted API", async () => {
        const error = await missingKeyError({});
        expect(error).toBeInstanceOf(DeepgramError);
        expect((error as DeepgramError).message).toContain(MISSING_KEY);
        expect((error as DeepgramError).message).not.toContain("auth: false");
    });

    it("keeps the generated message unchanged for a regional Deepgram host", async () => {
        const error = await missingKeyError({ baseUrl: "https://api.eu.deepgram.com" });
        expect((error as DeepgramError).message).not.toContain("auth: false");
    });

    it("does not treat a look-alike host as Deepgram's", async () => {
        const error = await missingKeyError({ baseUrl: "https://notdeepgram.com" });
        expect((error as DeepgramError).message).toContain("auth: false");
    });

    it("adds the hint on the streaming path too", async () => {
        const client = new DeepgramClient({ baseUrl: LOCAL });
        await expect(client.listen.v2.connect({ model: "flux-general-en", reconnectAttempts: 0 })).rejects.toThrow(
            /auth: false/,
        );
    });

    it("sends no Authorization header with auth: false", async () => {
        const client = new DeepgramClient({ baseUrl: LOCAL, auth: false, fetch: mockFetch, maxRetries: 0 });
        await client.manage.v1.models.list();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(String(mockFetch.mock.calls[0][0])).toContain(`${LOCAL}/v1/models`);
        expect(authHeaderSent()).toBeUndefined();
    });

    it("still sends a provided key to a local server", async () => {
        const client = new DeepgramClient({ baseUrl: LOCAL, apiKey: "local-key", fetch: mockFetch, maxRetries: 0 });
        await client.manage.v1.models.list();
        expect(authHeaderSent()).toBe("Token local-key");
    });
});
