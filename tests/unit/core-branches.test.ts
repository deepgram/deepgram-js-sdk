import { beforeEach, describe, expect, it } from "vitest";
import { DeepgramClient } from "../../src";
import { normalizeClientOptionsWithAuth } from "../../src/BaseClient.js";
import { isAuthProvider } from "../../src/core/auth/AuthProvider.js";
import { getErrorResponseBody } from "../../src/core/fetcher/getErrorResponseBody.js";

describe("isAuthProvider", () => {
    it("returns false for non-objects, null, and objects without a callable getAuthRequest", () => {
        expect(isAuthProvider("nope")).toBe(false);
        expect(isAuthProvider(null)).toBe(false);
        expect(isAuthProvider({})).toBe(false);
        expect(isAuthProvider({ getAuthRequest: 42 })).toBe(false);
    });

    it("returns true for an object with a getAuthRequest function", () => {
        expect(isAuthProvider({ getAuthRequest: async () => ({ headers: {} }) })).toBe(true);
    });
});

describe("normalizeClientOptionsWithAuth", () => {
    it("uses a NoOpAuthProvider when auth is disabled", async () => {
        const normalized = normalizeClientOptionsWithAuth({ auth: false });
        // `auth: false` is the opt-out for callers supplying their own credentials
        // (proxy, pre-signed URL). The contract is that the SDK attaches nothing —
        // asserting only that a provider exists would also accept one holding the key.
        expect(await normalized.authProvider.getAuthRequest()).toEqual({ headers: {} });
    });

    it("wraps an auth function", async () => {
        const normalized = normalizeClientOptionsWithAuth({
            auth: async () => ({ headers: { Authorization: "fn" } }),
        });
        expect((await normalized.authProvider.getAuthRequest()).headers).toEqual({ Authorization: "fn" });
    });

    it("uses a provided AuthProvider instance directly", async () => {
        const provider = { getAuthRequest: async () => ({ headers: { Authorization: "provider" } }) };
        const normalized = normalizeClientOptionsWithAuth({ auth: provider });
        expect(normalized.authProvider).toBe(provider);
    });

    it("merges a plain auth options object and falls back to the header provider", () => {
        const normalized = normalizeClientOptionsWithAuth({ auth: { apiKey: "merged" } as never });
        expect(normalized.authProvider).toBeDefined();
    });

    it("defaults to the header auth provider when no auth is supplied", () => {
        const normalized = normalizeClientOptionsWithAuth({ apiKey: "key" });
        expect(normalized.authProvider).toBeDefined();
    });
});

describe("getErrorResponseBody", () => {
    it("delegates to getResponseBody when no content-type is present", async () => {
        const res = new Response(JSON.stringify({ a: 1 }), { headers: {} });
        // node sets a default content-type for string bodies, so strip it
        res.headers.delete("content-type");
        expect(await getErrorResponseBody(res)).toBeDefined();
    });

    it("parses JSON bodies and strips content-type parameters", async () => {
        const res = new Response(JSON.stringify({ err: "x" }), {
            headers: { "content-type": "application/json; charset=utf-8" },
        });
        expect(await getErrorResponseBody(res)).toEqual({ err: "x" });
    });

    it("returns undefined for an empty JSON body", async () => {
        const res = new Response("", { headers: { "content-type": "application/json" } });
        expect(await getErrorResponseBody(res)).toBeUndefined();
    });

    it("parses vendor +json content types", async () => {
        const res = new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/vnd.custom+json" },
        });
        expect(await getErrorResponseBody(res)).toEqual({ ok: true });
    });

    it("falls back to text for unrecognized content types", async () => {
        const res = new Response("plain error", { headers: { "content-type": "text/plain" } });
        expect(await getErrorResponseBody(res)).toBe("plain error");
    });
});

describe("client.fetch passthrough baseUrl resolution", () => {
    // The request URL has to be captured, not just the status: `src/Client.ts`
    // carries a hand-maintained patch restoring `env.base` (api.deepgram.com) as
    // the passthrough default after a regen flipped it to `env.agentRest`. Only an
    // assertion on the resolved host stops the next regen undoing that silently.
    const calls: string[] = [];
    const okFetch: typeof fetch = async (input) => {
        calls.push(typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url);
        return new Response("{}", { status: 200 });
    };

    beforeEach(() => {
        calls.length = 0;
    });

    it("uses an explicit baseUrl when provided", async () => {
        const client = new DeepgramClient({ apiKey: "k", baseUrl: "https://custom.example.com", fetch: okFetch });
        const res = await client.fetch("/v1/anything");
        expect(res.status).toBe(200);
        expect(calls.at(-1)).toBe("https://custom.example.com/v1/anything");
    });

    it("resolves the base host from the default environment object", async () => {
        const client = new DeepgramClient({ apiKey: "k", fetch: okFetch });
        const res = await client.fetch("/v1/anything");
        expect(res.status).toBe(200);
        // Guards the `src/Client.ts` baseUrl patch: `agentRest` would send this to
        // agent.deepgram.com.
        expect(calls.at(-1)).toBe("https://api.deepgram.com/v1/anything");
    });

    it("resolves a string environment", async () => {
        const client = new DeepgramClient({
            apiKey: "k",
            environment: "https://env.example.com" as never,
            fetch: okFetch,
        });
        const res = await client.fetch(new URL("https://env.example.com/v1/anything"));
        expect(res.status).toBe(200);
        expect(calls.at(-1)).toBe("https://env.example.com/v1/anything");
    });

    it("accepts a Request object and Headers-instance init headers", async () => {
        const client = new DeepgramClient({ apiKey: "k", fetch: okFetch });
        const res = await client.fetch(new Request("https://api.deepgram.com/v1/anything"), {
            headers: new Headers({ "x-a": "1" }),
        });
        expect(res.status).toBe(200);
        // An absolute URL bypasses base resolution and is used verbatim.
        expect(calls.at(-1)).toBe("https://api.deepgram.com/v1/anything");
    });

    it("accepts array-shaped and plain-object init headers", async () => {
        const client = new DeepgramClient({ apiKey: "k", headers: { "x-default": "d" }, fetch: okFetch });
        const arrayHeaders = await client.fetch("/v1/anything", { headers: [["x-arr", "1"]] });
        expect(arrayHeaders.status).toBe(200);
        const objectHeaders = await client.fetch("/v1/anything", { headers: { "x-obj": "1" } });
        expect(objectHeaders.status).toBe(200);
        expect(calls).toEqual(["https://api.deepgram.com/v1/anything", "https://api.deepgram.com/v1/anything"]);
    });
});
