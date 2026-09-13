import { describe, it, expect } from "vitest";
import type { DeepgramClient } from "../../src";

// Type-only handle for compile-time call-site assertions. Never assigned at runtime;
// the `declare` binding lets the closures below be type-checked without connecting.
declare const client: DeepgramClient;

/**
 * Compile-time coverage for async iteration on the streaming sockets (issue #549).
 *
 * The point of typing the iterator off each socket's own `Response` union rather than
 * `unknown` is that `message.type` narrows inside the loop. That is a compile-time
 * guarantee only, so it cannot be asserted at runtime — if the iterator ever loses its
 * element type, this file stops compiling and `make typecheck-tests` fails before any
 * test body runs.
 */
describe("Socket async iteration types", () => {
    it("narrows listen v1 messages by discriminant inside for await", () => {
        const _check = async () => {
            const connection = await client.listen.v1.connect({ model: "nova-3" });
            for await (const message of connection) {
                if (message.type === "Results" && message.is_final) {
                    // Reachable only if `message` narrowed to ListenV1Results.
                    const _transcript: string | undefined = message.channel?.alternatives?.[0]?.transcript;
                }
            }
        };
        expect(typeof _check).toBe("function");
    });

    it("narrows listen v2 messages by discriminant inside for await", () => {
        const _check = async () => {
            const connection = await client.listen.v2.connect({ model: "flux-general-en" });
            for await (const message of connection) {
                if (message.type === "TurnInfo") {
                    const _transcript: string | undefined = message.transcript;
                }
            }
        };
        expect(typeof _check).toBe("function");
    });

    it("surfaces binary audio as a Blob on the sockets that carry it", () => {
        const _check = async () => {
            const connection = await client.agent.v1.connect();
            for await (const message of connection) {
                if (message instanceof Blob) {
                    const _size: number = message.size;
                } else if (typeof message !== "string" && message.type === "ConversationText") {
                    // The generated agent Response union also admits a bare `string`, so a
                    // caller narrows that away before reading a discriminant — same as with
                    // on("message", ...).
                    const _content: string | undefined = message.content;
                }
            }
        };
        expect(typeof _check).toBe("function");
    });
});
