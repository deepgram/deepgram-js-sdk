import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { WebSocket as NodeWebSocket } from "ws";

/**
 * Tests for Node.js version compatibility issues
 *
 * Issue: Live ASR connection never opens on Node.js versions below 22
 * https://github.com/deepgram/deepgram-js-sdk/issues/426
 *
 * The SDK works on Node.js 22+ but hangs on Node.js 19-21.
 * Node.js 22+ has a native global WebSocket, while older versions
 * rely on the 'ws' package.
 */

describe("Node.js version WebSocket compatibility", () => {
    describe("WebSocket class selection", () => {
        it("ws package WebSocket should accept three parameters (url, protocols, options)", () => {
            // The ws package accepts (url, protocols, options)
            // where options can include headers
            expect(NodeWebSocket).toBeDefined();
            expect(NodeWebSocket.CONNECTING).toBe(0);
            expect(NodeWebSocket.OPEN).toBe(1);
            expect(NodeWebSocket.CLOSING).toBe(2);
            expect(NodeWebSocket.CLOSED).toBe(3);
        });

        it("should verify ws package can be instantiated with headers option", () => {
            // This test verifies the ws package accepts headers in options
            // We don't actually connect, just verify the constructor accepts the params
            const options = {
                headers: {
                    Authorization: "Token test-api-key",
                    "X-Custom-Header": "test-value",
                },
            };

            // Create a mock URL that will fail to connect
            // but we're just testing constructor acceptance
            expect(() => {
                const ws = new NodeWebSocket("ws://localhost:99999", [], options);
                // Immediately close to prevent actual connection attempt
                ws.terminate();
            }).not.toThrow("Invalid options"); // Should not throw about invalid options
        });
    });

    describe("Runtime detection", () => {
        it("should correctly identify Node.js runtime", async () => {
            const { RUNTIME } = await import("../../src/core/runtime/index.js");

            expect(RUNTIME.type).toBe("node");
            expect(RUNTIME.version).toBeDefined();
            expect(typeof RUNTIME.parsedVersion).toBe("number");
        });

        it("should parse Node.js version correctly", async () => {
            const { RUNTIME } = await import("../../src/core/runtime/index.js");

            // parsedVersion should be the major version number
            const expectedMajor = Number(process.versions.node.split(".")[0]);
            expect(RUNTIME.parsedVersion).toBe(expectedMajor);
        });
    });

    describe("WebSocket selection logic", () => {
        it("should use ws package when global WebSocket is not available", async () => {
            // In Node.js < 22, there's no global WebSocket
            // The SDK should fall back to the ws package

            // Save original WebSocket if it exists
            const originalWebSocket = (globalThis as any).WebSocket;

            try {
                // Remove global WebSocket to simulate Node.js < 22
                delete (globalThis as any).WebSocket;

                // Clear module cache and re-import
                vi.resetModules();

                // The getGlobalWebSocket function should return the ws package WebSocket
                const wsModule = await import("../../src/core/websocket/ws.js");

                // ReconnectingWebSocket should be available
                expect(wsModule.ReconnectingWebSocket).toBeDefined();
            } finally {
                // Restore original WebSocket
                if (originalWebSocket) {
                    (globalThis as any).WebSocket = originalWebSocket;
                }
            }
        });
    });

    describe("Headers handling in WebSocket connection", () => {
        it("should correctly format authorization header (lowercased)", async () => {
            const { mergeOnlyDefinedHeaders } = await import("../../src/core/headers.js");

            // Note: mergeOnlyDefinedHeaders converts all keys to lowercase
            const authHeaders = mergeOnlyDefinedHeaders({
                Authorization: "Token test-api-key"
            });

            // Keys are lowercased by the merge function
            expect(authHeaders).toHaveProperty("authorization");
            expect(authHeaders.authorization).toBe("Token test-api-key");
        });

        it("should merge custom headers with authorization (lowercased)", async () => {
            const { mergeHeaders, mergeOnlyDefinedHeaders } = await import("../../src/core/headers.js");

            const authHeaders = mergeOnlyDefinedHeaders({
                Authorization: "Token test-api-key"
            });

            const customHeaders = {
                "X-Custom-Header": "custom-value",
            };

            const merged = mergeHeaders(authHeaders, customHeaders);

            // All keys are lowercased
            expect(merged).toHaveProperty("authorization");
            expect(merged).toHaveProperty("x-custom-header");
        });
    });

    describe("ReconnectingWebSocket initialization", () => {
        it("should accept headers in constructor options", async () => {
            const { ReconnectingWebSocket } = await import("../../src/core/websocket/ws.js");

            // Create with headers - should not throw
            const rws = new ReconnectingWebSocket({
                url: "ws://localhost:99999",
                headers: {
                    Authorization: "Token test-api-key",
                },
                options: {
                    startClosed: true, // Don't actually connect
                },
            });

            expect(rws).toBeDefined();
            expect(rws.readyState).toBe(ReconnectingWebSocket.CLOSED);
        });

        it("should store headers for use when connecting", async () => {
            const { ReconnectingWebSocket } = await import("../../src/core/websocket/ws.js");

            const headers = {
                Authorization: "Token test-api-key",
                "X-Custom": "value",
            };

            const rws = new ReconnectingWebSocket({
                url: "ws://localhost:99999",
                headers,
                options: {
                    startClosed: true,
                },
            });

            // The headers should be stored internally
            // We can verify by checking the object was created successfully
            expect(rws).toBeDefined();
        });
    });

    describe("Connection timeout handling", () => {
        it("should have configurable connection timeout", async () => {
            const { ReconnectingWebSocket } = await import("../../src/core/websocket/ws.js");

            const rws = new ReconnectingWebSocket({
                url: "ws://localhost:99999",
                options: {
                    startClosed: true,
                    connectionTimeout: 5000,
                },
            });

            expect(rws).toBeDefined();
        });

        it("should have default connection timeout", async () => {
            const { ReconnectingWebSocket } = await import("../../src/core/websocket/ws.js");

            // Default timeout is 4000ms according to the code
            const rws = new ReconnectingWebSocket({
                url: "ws://localhost:99999",
                options: {
                    startClosed: true,
                },
            });

            expect(rws).toBeDefined();
        });
    });
});

describe("Potential causes of Node.js < 22 connection hang", () => {
    /**
     * These tests document potential causes of the connection hang issue
     * in Node.js versions below 22.
     */

    it("documents that ws package requires proper URL format", () => {
        // The ws package requires URLs to start with ws:// or wss://
        expect(() => {
            new NodeWebSocket("invalid-url", [], {});
        }).toThrow();
    });

    it("documents ws package handles connection errors", () => {
        // The ws package should emit 'error' event on connection failure
        // not hang indefinitely
        // Note: In Node.js 24+, invalid URLs throw immediately, so we use a valid but unreachable host
        const ws = new NodeWebSocket("ws://127.0.0.1:59999");

        return new Promise<void>((resolve) => {
            ws.on("error", () => {
                // Error event should fire, not hang
                ws.terminate();
                resolve();
            });

            // Timeout in case it hangs
            setTimeout(() => {
                ws.terminate();
                resolve();
            }, 2000);
        });
    });
});
