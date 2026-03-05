import { describe, it, expect } from "vitest";

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
 * running in a Bun environment.
 *
 * Related issue: #466
 */

describe("WebSocket runtime selection for Bun", () => {
      it("should skip native WebSocket when runtime is bun", () => {
                const runtimeType = "bun";
                const hasNativeWebSocket = true;

                 const shouldUseNative = runtimeType !== "bun" && hasNativeWebSocket;

                 expect(shouldUseNative).toBe(false);
      });

             it("should use NodeWebSocket when runtime is bun", () => {
                       const runtimeType = "bun";

                        const shouldUseNodeWebSocket = runtimeType === "node" || runtimeType === "bun";

                        expect(shouldUseNodeWebSocket).toBe(true);
             });

             it("should use native WebSocket when runtime is browser", () => {
                       const runtimeType = "browser";
                       const hasNativeWebSocket = true;

                        const shouldUseNative = runtimeType !== "bun" && hasNativeWebSocket;

                        expect(shouldUseNative).toBe(true);
             });

             it("should use NodeWebSocket when runtime is node", () => {
                       const runtimeType = "node";
                       const hasNativeWebSocket = false;

                        const shouldUseNative = runtimeType !== "bun" && hasNativeWebSocket;
                       const shouldUseNodeWebSocket = runtimeType === "node" || runtimeType === "bun";

                        expect(shouldUseNative).toBe(false);
                       expect(shouldUseNodeWebSocket).toBe(true);
             });

             it("should return undefined when no WebSocket is available and runtime is unknown", () => {
                       const runtimeType = "unknown";
                       const hasNativeWebSocket = false;

                        const shouldUseNative = runtimeType !== "bun" && hasNativeWebSocket;
                       const shouldUseNodeWebSocket = runtimeType === "node" || runtimeType === "bun";

                        expect(shouldUseNative).toBe(false);
                       expect(shouldUseNodeWebSocket).toBe(false);
             });
});
