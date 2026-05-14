import { describe, it, expect } from "vitest";
import type {
    AgentV1Settings,
    AgentV1SettingsAgentContextListenProvider,
    AgentV1SettingsAgentListenProvider,
    CreateKeyV1Request,
    CreateKeyV1RequestOne,
    DeepgramClient,
} from "../../src";
import { Deepgram } from "../../src";

// Type-only handle for compile-time call-site assertions. Never assigned at
// runtime — the `declare` binding lets us write expressions like
// `client.manage.v1.projects.keys.create("project_id")` purely for type
// checking. Any closure that references it must not be invoked.
declare const client: DeepgramClient;

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
                messages: [{ type: "History", role: "user", content: "hello" }],
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
            const _equality: Equals<Deepgram.agent.AgentV1Settings.Agent.Context, AgentV1Settings.Agent.Context> = true;
            expect(_equality).toBe(true);
        });

        it("settings.agent fields are directly readable without typeof narrowing", () => {
            // Pre-regen, `Agent` was an interface so reads like `agent.greeting`
            // and `agent.context?.messages` worked directly. The shim restores
            // the interface form so this stays legal in TS strict mode without
            // a `typeof settings.agent !== "string"` guard.
            const settings: AgentV1Settings = {
                type: "Settings",
                audio: { input: { encoding: "linear16", sample_rate: 24000 } },
                agent: {
                    greeting: "Hello",
                    context: {
                        messages: [{ type: "History", role: "user", content: "hi" }],
                    },
                },
            };
            expect(settings.agent.greeting).toBe("Hello");
            expect(settings.agent.context?.messages).toHaveLength(1);
        });

        it("AgentReference accepts both an Agent settings object and a string agent ID", () => {
            const asObject: AgentV1Settings.AgentReference = { greeting: "Hello" };
            const asId: AgentV1Settings.AgentReference = "agent_123";
            expect((asObject as AgentV1Settings.Agent).greeting).toBe("Hello");
            expect(asId).toBe("agent_123");
        });
    });

    describe("manage.v1.projects.keys.create (request? optionality patch)", () => {
        it("accepts a project_id without a request body at the type level", () => {
            // Type-only: if a future regen drops the `request?` optionality
            // patch on KeysClient#create, this call site fails to compile and
            // the test run fails before any test body executes. The arrow
            // function is constructed but never invoked, so the unbound
            // `client` reference is safe at runtime.
            const _noArgIsCallable = (): unknown => client.manage.v1.projects.keys.create("project_id");
            expect(typeof _noArgIsCallable).toBe("function");
        });

        it("still accepts a request body as the second argument", () => {
            const _withBodyIsCallable = (): unknown =>
                client.manage.v1.projects.keys.create("project_id", {
                    comment: "compat check",
                    scopes: ["usage:read"],
                });
            expect(typeof _withBodyIsCallable).toBe("function");
        });
    });

    describe("AgentV1SettingsAgentListenProvider (aliased to *AgentContextListenProvider 2026-05-06)", () => {
        it("old name still exists at the top-level export", () => {
            // Sanity: the old type is still in the public surface even though
            // generated code now uses the new context-prefixed name.
            const _old: AgentV1SettingsAgentListenProvider = { version: "v1", type: "deepgram", model: "nova-3" };
            expect(_old.type).toBe("deepgram");
        });

        it("old name is a type-identical alias for the new context-prefixed name", () => {
            // The patched AgentV1SettingsAgentListenProvider.ts collapses the
            // regenerated duplicate into a one-line alias, so the two names
            // resolve to the exact same type. If a future regen blows away
            // the alias, this Equals<X, Y> identity check fails to compile.
            const _equality: Equals<AgentV1SettingsAgentListenProvider, AgentV1SettingsAgentContextListenProvider> =
                true;
            expect(_equality).toBe(true);
        });

        it("nested .V1 and .V2 namespaces resolve through the alias", () => {
            const _v1Equality: Equals<
                AgentV1SettingsAgentListenProvider.V1,
                AgentV1SettingsAgentContextListenProvider.V1
            > = true;
            const _v2Equality: Equals<
                AgentV1SettingsAgentListenProvider.V2,
                AgentV1SettingsAgentContextListenProvider.V2
            > = true;
            expect(_v1Equality).toBe(true);
            expect(_v2Equality).toBe(true);
        });

        it("legacy V2 literal (no language_hint) still compiles under the alias", () => {
            // Pre-regen V2 had no `language_hint`. Because the new V2 adds it
            // as optional, old literals continue to type-check unchanged.
            const _legacy: AgentV1SettingsAgentListenProvider.V2 = {
                version: "v2",
                type: "deepgram",
                model: "flux-general-en",
            };
            expect(_legacy.version).toBe("v2");
        });
    });
});
