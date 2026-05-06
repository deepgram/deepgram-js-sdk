import { describe, it, expect } from "vitest";
import type { AgentV1Settings, CreateKeyV1Request, CreateKeyV1RequestOne } from "../../src";
import { Deepgram } from "../../src";

/**
 * Regression test for backward-compatibility aliases preserved across SDK
 * regenerations.
 *
 * Each `as` cast in this file is a structural type-equality assertion: if the
 * legacy alias ever drifts from its canonical type, the file will fail to
 * compile and the test run will fail before any test body executes.
 *
 * Because TypeScript types are erased at runtime, the runtime assertions only
 * confirm that the *imports* resolve. Type identity is enforced by the
 * compile-time casts.
 */

// Compile-time identity check for `Equals<X, Y>`. This pattern returns `true`
// only when X and Y are the exact same type, including variance.
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe("Backwards-compatibility aliases", () => {
    describe("CreateKeyV1RequestOne (renamed to CreateKeyV1Request)", () => {
        it("flat re-export is identical to CreateKeyV1Request", () => {
            const _equality: Equals<CreateKeyV1RequestOne, CreateKeyV1Request> = true;
            expect(_equality).toBe(true);
        });

        it("is bidirectionally assignable with CreateKeyV1Request", () => {
            const fromCanonical: CreateKeyV1RequestOne = {} as CreateKeyV1Request;
            const fromLegacy: CreateKeyV1Request = {} as CreateKeyV1RequestOne;
            expect(fromCanonical).toBeDefined();
            expect(fromLegacy).toBeDefined();
        });

        it("Deepgram namespace re-export is identical to Deepgram.CreateKeyV1Request", () => {
            const _equality: Equals<Deepgram.CreateKeyV1RequestOne, Deepgram.CreateKeyV1Request> = true;
            expect(_equality).toBe(true);
        });

        it("accepts a request body shape suitable for keys.create", () => {
            const request: CreateKeyV1RequestOne = {
                comment: "back-compat alias check",
                scopes: ["usage:read"],
            };
            expect(request).toEqual({
                comment: "back-compat alias check",
                scopes: ["usage:read"],
            });
        });
    });

    describe("AgentV1Settings.Agent namespace (restructured to union 2026-05-06)", () => {
        it("Agent.Context resolves to the inline context object shape", () => {
            const ctx: AgentV1Settings.Agent.Context = {
                messages: [
                    { type: "History", role: "user", content: "hello" },
                ],
            };
            expect(ctx.messages).toHaveLength(1);
        });

        it("Agent.Context.Messages.Item accepts both history variants", () => {
            const text: AgentV1Settings.Agent.Context.Messages.Item = {
                type: "History",
                role: "assistant",
                content: "hi there",
            };
            const fcall: AgentV1Settings.Agent.Context.Messages.Item = {
                type: "History",
                function_calls: [
                    {
                        id: "call_1",
                        name: "lookup",
                        client_side: true,
                        arguments: "{}",
                        response: "{}",
                    },
                ],
            };
            expect(text.type).toBe("History");
            expect(fcall.type).toBe("History");
        });

        it("Agent.Listen resolves to the inline listen object shape", () => {
            const listen: AgentV1Settings.Agent.Listen = {};
            expect(listen).toBeDefined();
        });

        it("Agent.Think and Agent.Speak resolve to the provider settings shapes", () => {
            const think: AgentV1Settings.Agent.Think = [] as Deepgram.ThinkSettingsV1[];
            const speak: AgentV1Settings.Agent.Speak = [] as Deepgram.SpeakSettingsV1[];
            expect(Array.isArray(think)).toBe(true);
            expect(Array.isArray(speak)).toBe(true);
        });

        it("Deepgram namespace re-export preserves the same sub-types", () => {
            const _equality: Equals<
                Deepgram.agent.AgentV1Settings.Agent.Context,
                AgentV1Settings.Agent.Context
            > = true;
            expect(_equality).toBe(true);
        });
    });
});
