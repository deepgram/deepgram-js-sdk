import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Force the SDK to believe it is running in a browser so the websocket
// connection helper takes the browser branch (auth is carried via
// Sec-WebSocket-Protocol instead of headers, which native browser WebSocket
// cannot set).
vi.mock("../../src/core/runtime/index.js", () => ({
    RUNTIME: { type: "browser" },
}));

import { DeepgramClient } from "../../src";

function protocolsOf(wrapped: unknown): string[] {
    return (wrapped as any).socket._protocols ?? [];
}

describe("browser websocket connection (getWebSocketOptions)", () => {
    it("encodes an api key as token,<key> protocols and strips the Authorization header", async () => {
        const client = new DeepgramClient({ apiKey: "secret-key" });
        const socket = await client.listen.v1.connect({ model: "nova-3" });
        const protocols = protocolsOf(socket);
        expect(protocols).toContain("token");
        expect(protocols).toContain("secret-key");

        const headers = (socket as any).socket._headers ?? {};
        expect(headers.Authorization).toBeUndefined();
        expect(headers.authorization).toBeUndefined();
        expect(headers["x-deepgram-session-id"]).toBeUndefined();
    });

    it("encodes an access token as bearer,<token> protocols", async () => {
        const client = new DeepgramClient({ apiKey: "secret-key", accessToken: "access-tok" });
        const socket = await client.listen.v2.connect({ model: "flux-general-en" });
        const protocols = protocolsOf(socket);
        expect(protocols).toContain("bearer");
        expect(protocols).toContain("access-tok");
    });

    it("uses a scheme-less auth header verbatim as a protocol", async () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        // A connect-level Authorization header overrides the wrapped one; when it
        // has no Token/Bearer scheme it is pushed as a protocol as-is.
        const socket = await client.listen.v1.connect({
            model: "nova-3",
            headers: { Authorization: "custombare" },
        });
        expect(protocolsOf(socket)).toContain("custombare");
    });

    it("carries the session id as a protocol pair", async () => {
        const client = new DeepgramClient({ apiKey: "secret-key" });
        const socket = await client.agent.v1.connect();
        const protocols = protocolsOf(socket);
        expect(protocols).toContain("x-deepgram-session-id");
        // the value is the client's generated session id
        expect(protocols).toContain(client.sessionId);
    });

    it("supports the speak websocket in the browser too", async () => {
        const client = new DeepgramClient({ apiKey: "secret-key" });
        const socket = await client.speak.v1.connect({ model: "aura-2-thalia-en" });
        expect(protocolsOf(socket)).toContain("token");
    });
});

describe("generateUUID manual fallback", () => {
    let originalCrypto: typeof globalThis.crypto;

    beforeEach(() => {
        originalCrypto = globalThis.crypto;
    });

    afterEach(() => {
        vi.stubGlobal("crypto", originalCrypto);
        vi.unstubAllGlobals();
    });

    it("generates a v4-shaped uuid when no crypto API is available", () => {
        // RUNTIME is mocked to "browser", so removing crypto forces the manual path.
        vi.stubGlobal("crypto", undefined);
        const client = new DeepgramClient({ apiKey: "secret-key" });
        expect(client.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
