import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGlobalWebSocket } from "../../src/core/websocket/ws.js";
import { WebSocket as NodeWebSocket } from "ws";

/**
 * Tests for WebSocket runtime selection in Bun environments.
 *
 * Bun's native WebSocket constructor ignores the 3rd `options` argument,
 * which means custom headers (including `Authorization`) are silently
 * dropped. This causes authentication failures when connecting to
 * Deepgram's WebSocket API.
 *
 * The fix ensures that `getGlobalWebSocket()` returns `NodeWebSocket`
 * (from the `ws` library) instead of Bun's native `WebSocket` when
 * running in a server runtime.
 *
 * Related issue: #466
 */

// Mock the RUNTIME object
vi.mock("../../src/core/runtime/index.js", () => {
    return {
        RUNTIME: {
            type: "browser"
        }
    };
});

import { RUNTIME } from "../../src/core/runtime/index.js";

describe("WebSocket runtime selection logic", () => {
    let originalWebSocket: any;

    beforeEach(() => {
        originalWebSocket = (globalThis as any).WebSocket;
    });

    afterEach(() => {
        if (originalWebSocket !== undefined) {
            (globalThis as any).WebSocket = originalWebSocket;
        } else {
            delete (globalThis as any).WebSocket;
        }
    });

    it("should return NodeWebSocket when runtime is bun", () => {
        RUNTIME.type = "bun";
        (globalThis as any).WebSocket = class NativeBunWebSocket {};

        const wsClass = getGlobalWebSocket();
        
        expect(wsClass).toBe(NodeWebSocket);
        expect(wsClass).not.toBe((globalThis as any).WebSocket);
    });

    it("should return NodeWebSocket when runtime is node", () => {
        RUNTIME.type = "node";
        (globalThis as any).WebSocket = class NativeNodeWebSocket {}; // Simulating Node 21+

        const wsClass = getGlobalWebSocket();
        
        expect(wsClass).toBe(NodeWebSocket);
    });

    it("should return native WebSocket when runtime is browser", () => {
        RUNTIME.type = "browser";
        const MockNativeWebSocket = class {};
        (globalThis as any).WebSocket = MockNativeWebSocket;

        const wsClass = getGlobalWebSocket();
        
        expect(wsClass).toBe(MockNativeWebSocket);
        expect(wsClass).not.toBe(NodeWebSocket);
    });

    it("should return undefined when no WebSocket is available and runtime is unknown", () => {
        RUNTIME.type = "unknown";
        delete (globalThis as any).WebSocket;

        const wsClass = getGlobalWebSocket();
        
        expect(wsClass).toBeUndefined();
    });
});
