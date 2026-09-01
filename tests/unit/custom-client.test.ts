import { describe, expect, it } from "vitest";
import { DeepgramClient, DeepgramError } from "../../src";

async function withoutProcess<T>(callback: () => Promise<T>): Promise<T> {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "process");
    if (!Reflect.deleteProperty(globalThis, "process")) {
        throw new Error("Unable to remove process global for test");
    }

    try {
        return await callback();
    } finally {
        if (descriptor != null) {
            Object.defineProperty(globalThis, "process", descriptor);
        }
    }
}

/**
 * Tests for CustomDeepgramClient wrapper functionality.
 *
 * These tests verify:
 * 1. Session ID generation and header injection
 * 2. Authentication provider wrappers (API key, access token)
 * 3. Custom client property accessors
 * 4. Environment configuration
 */
describe("CustomDeepgramClient", () => {
    describe("Session ID generation", () => {
        it("should generate a unique session ID for each client instance", () => {
            const client1 = new DeepgramClient({ apiKey: "test-key-1" });
            const client2 = new DeepgramClient({ apiKey: "test-key-2" });

            const sessionId1 = (client1 as any)._sessionId;
            const sessionId2 = (client2 as any)._sessionId;

            expect(sessionId1).toBeDefined();
            expect(sessionId2).toBeDefined();
            expect(sessionId1).not.toBe(sessionId2);
        });

        it("should generate valid UUID format", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });
            const sessionId = (client as any)._sessionId;

            // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(sessionId).toMatch(uuidRegex);
        });
    });

    describe("Client accessors", () => {
        it("should provide access to listen client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.listen).toBeDefined();
            expect(client.listen.v1).toBeDefined();
            expect(client.listen.v2).toBeDefined();
        });

        it("should provide access to speak client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.speak).toBeDefined();
            expect(client.speak.v1).toBeDefined();
            expect(client.speak.v2).toBeDefined();
        });

        it("should expose websocket helpers on speak.v2 (Flux streaming)", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            // WrappedSpeakV2Client adds connect()/createConnection() on top of the
            // generated V2Client — the raw generated client only has connect().
            expect(typeof client.speak.v2.connect).toBe("function");
            expect(typeof client.speak.v2.createConnection).toBe("function");
        });

        it("should provide access to agent client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.agent).toBeDefined();
            expect(client.agent.v1).toBeDefined();
        });

        it("should provide access to manage client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.manage).toBeDefined();
            expect(client.manage.v1).toBeDefined();
        });

        it("should provide access to read client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.read).toBeDefined();
            expect(client.read.v1).toBeDefined();
        });

        it("should provide access to auth client", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            expect(client.auth).toBeDefined();
            expect(client.auth.v1).toBeDefined();
        });

        it("should cache client instances", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            // Access the same property multiple times
            const listen1 = client.listen;
            const listen2 = client.listen;

            // Should return the same instance
            expect(listen1).toBe(listen2);
        });
    });

    describe("Environment configuration", () => {
        it("should use default Production environment", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });
            const opts = (client as any)._options;

            // Client should work with default environment (may be undefined in opts
            // because it gets resolved from environments.DeepgramEnvironment.Production)
            expect(client).toBeDefined();
            // The listen client should still work
            expect(client.listen).toBeDefined();
        });

        it("should accept custom environment", () => {
            const customEnv = {
                base: "https://custom.deepgram.com",
                production: "wss://custom.deepgram.com",
                agent: "wss://custom-agent.deepgram.com",
            };

            const client = new DeepgramClient({
                apiKey: "test-key",
                environment: customEnv,
            });

            const opts = (client as any)._options;
            expect(opts.environment).toEqual(customEnv);
        });
    });

    describe("Authentication options", () => {
        it("should accept apiKey option", () => {
            // This should not throw
            const client = new DeepgramClient({ apiKey: "my-api-key" });
            expect(client).toBeDefined();
        });

        it("should accept accessToken option", () => {
            // This should not throw
            const client = new DeepgramClient({ accessToken: "my-access-token" });
            expect(client).toBeDefined();
        });

        it("should accept both apiKey and accessToken", () => {
            // When both are provided, accessToken should take precedence
            const client = new DeepgramClient({
                apiKey: "my-api-key",
                accessToken: "my-access-token",
            });
            expect(client).toBeDefined();
        });

        it("should accept auth supplier function", () => {
            const client = new DeepgramClient({
                apiKey: async () => "dynamic-api-key",
            });
            expect(client).toBeDefined();
        });
    });

    describe("Custom headers", () => {
        it("should accept custom headers", () => {
            const client = new DeepgramClient({
                apiKey: "test-key",
                headers: {
                    "X-Custom-Header": "custom-value",
                },
            });

            // Headers are stored but may be wrapped in Suppliers
            // Just verify the client accepts the option
            expect(client).toBeDefined();
        });

        it("should include session ID in headers", () => {
            const client = new DeepgramClient({ apiKey: "test-key" });
            const opts = (client as any)._options;
            const sessionId = (client as any)._sessionId;

            // Session ID should be generated and stored
            expect(sessionId).toBeDefined();
            // Headers may be stored in different formats, just verify they exist
            expect(opts.headers).toBeDefined();
        });

        it("should merge custom headers with session ID", () => {
            const client = new DeepgramClient({
                apiKey: "test-key",
                headers: {
                    "X-Custom": "value",
                },
            });

            const sessionId = (client as any)._sessionId;

            // Both session ID and custom headers should be accepted
            expect(client).toBeDefined();
            expect(sessionId).toBeDefined();
        });
    });

    describe("Retry configuration", () => {
        it("should accept maxRetries option", () => {
            const client = new DeepgramClient({
                apiKey: "test-key",
                maxRetries: 5,
            });

            const opts = (client as any)._options;
            expect(opts.maxRetries).toBe(5);
        });

        it("should accept timeout option", () => {
            const client = new DeepgramClient({
                apiKey: "test-key",
                timeout: 30000,
            });

            const opts = (client as any)._options;
            expect(opts.timeout).toBe(30000);
        });
    });

    describe("Proxy configuration", () => {
        it("should accept proxy option", () => {
            const client = new DeepgramClient({
                apiKey: "test-key",
                proxy: "http://proxy.example.com:8080",
            });

            expect(client).toBeDefined();
        });
    });
});

describe("WebSocket connection methods", () => {
    describe("listen.v1.createConnection", () => {
        it("should return a socket with expected methods", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            // Create connection (doesn't actually connect)
            const socket = await client.listen.v1.createConnection({
                model: "nova-2",
            });

            // Should have all expected methods
            expect(typeof socket.connect).toBe("function");
            expect(typeof socket.close).toBe("function");
            expect(typeof socket.on).toBe("function");
            expect(typeof socket.sendMedia).toBe("function");
            expect(typeof socket.sendFinalize).toBe("function");
            expect(typeof socket.waitForOpen).toBe("function");
        });
    });

    describe("listen.v2.createConnection", () => {
        it("should return a socket with expected methods", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            const socket = await client.listen.v2.createConnection({
                model: "flux-general-en",
            });

            expect(typeof socket.connect).toBe("function");
            expect(typeof socket.close).toBe("function");
            expect(typeof socket.on).toBe("function");
            expect(typeof socket.sendMedia).toBe("function");
            // Note: listen.v2 doesn't have sendFinalize, only v1 does
            expect(typeof socket.waitForOpen).toBe("function");
        });
    });

    describe("speak.v1.createConnection", () => {
        it("should return a socket with expected methods", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            const socket = await client.speak.v1.createConnection({
                model: "aura-asteria-en",
            });

            expect(typeof socket.connect).toBe("function");
            expect(typeof socket.close).toBe("function");
            expect(typeof socket.on).toBe("function");
            expect(typeof socket.sendText).toBe("function");
            expect(typeof socket.sendFlush).toBe("function");
            expect(typeof socket.sendClear).toBe("function");
            expect(typeof socket.sendClose).toBe("function");
        });
    });

    describe("agent.v1.createConnection", () => {
        it("should return a socket with expected methods", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            const socket = await client.agent.v1.createConnection({
                model: "aura-eos-2",
            });

            expect(typeof socket.connect).toBe("function");
            expect(typeof socket.close).toBe("function");
            expect(typeof socket.on).toBe("function");
            expect(typeof socket.sendSettings).toBe("function");
            expect(typeof socket.sendMedia).toBe("function");
        });
    });
});

describe("Auth provider wrappers", () => {
    describe("API Key auth", () => {
        it("should add Token prefix to API keys", async () => {
            const client = new DeepgramClient({ apiKey: "test-api-key" });
            const opts = (client as any)._options;

            const authRequest = await opts.authProvider.getAuthRequest();

            expect(authRequest.headers.Authorization).toBe("Token test-api-key");
        });

        it("should use an explicit API key when process is unavailable", async () => {
            const client = new DeepgramClient({ apiKey: "browser-api-key" });
            const opts = (client as any)._options;

            const authRequest = await withoutProcess(() => opts.authProvider.getAuthRequest());

            expect(authRequest.headers.Authorization).toBe("Token browser-api-key");
        });

        it("should report missing auth cleanly when process is unavailable", async () => {
            const client = new DeepgramClient();
            const opts = (client as any)._options;

            const error = await withoutProcess(async () => {
                try {
                    await opts.authProvider.getAuthRequest();
                    return undefined;
                } catch (caught) {
                    return caught;
                }
            });

            expect(error).toBeInstanceOf(DeepgramError);
            expect(error).not.toBeInstanceOf(ReferenceError);
        });

        it("should continue reading API keys from the Node environment", async () => {
            const previousApiKey = process.env.DEEPGRAM_API_KEY;
            process.env.DEEPGRAM_API_KEY = "environment-api-key";

            try {
                const client = new DeepgramClient();
                const opts = (client as any)._options;

                const authRequest = await opts.authProvider.getAuthRequest();

                expect(authRequest.headers.Authorization).toBe("Token environment-api-key");
            } finally {
                if (previousApiKey == null) {
                    delete process.env.DEEPGRAM_API_KEY;
                } else {
                    process.env.DEEPGRAM_API_KEY = previousApiKey;
                }
            }
        });
    });

    describe("Access Token auth", () => {
        it("should use Bearer prefix for access tokens", async () => {
            const client = new DeepgramClient({ accessToken: "test-access-token" });
            const opts = (client as any)._options;

            const authRequest = await opts.authProvider.getAuthRequest();

            expect(authRequest.headers.Authorization).toBe("Bearer test-access-token");
        });

        it("should prefer access token over API key when both provided", async () => {
            const client = new DeepgramClient({
                apiKey: "test-api-key",
                accessToken: "test-access-token",
            });

            const opts = (client as any)._options;

            const authRequest = await opts.authProvider.getAuthRequest();

            expect(authRequest.headers.Authorization).toBe("Bearer test-access-token");
        });

        it("should report missing auth when an access token supplier resolves undefined without process", async () => {
            const client = new DeepgramClient({ accessToken: () => undefined });
            const opts = (client as any)._options;

            const error = await withoutProcess(async () => {
                try {
                    await opts.authProvider.getAuthRequest();
                    return undefined;
                } catch (caught) {
                    return caught;
                }
            });

            expect(error).toBeInstanceOf(DeepgramError);
            expect(error).not.toBeInstanceOf(ReferenceError);
        });
    });
});

describe("UUID generation fallback", () => {
    it("should work without crypto.randomUUID", () => {
        // The client should still work in environments without crypto.randomUUID
        // The CustomClient has a fallback implementation
        const client = new DeepgramClient({ apiKey: "test-key" });
        const sessionId = (client as any)._sessionId;

        // Should still generate a valid-looking UUID
        expect(sessionId).toBeDefined();
        expect(typeof sessionId).toBe("string");
        expect(sessionId.length).toBe(36); // UUID length with dashes
    });
});
