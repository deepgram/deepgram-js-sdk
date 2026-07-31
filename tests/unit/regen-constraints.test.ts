import { describe, it, expect } from "vitest";
import type { DeepgramListenProviderV2, ListenV2ProfanityFilter } from "../../src";
import { Deepgram } from "../../src";

/**
 * Regression coverage for the constraints and compat shims introduced by the
 * 2026-06-16 regeneration:
 *   - `ListenV2CloseStream.type` literal + the trimmed `Type` shim
 *   - `DeepgramListenProviderV2.language_hints` (with the deprecated
 *     `language_hint` field kept for back-compat)
 *   - the new `ListenV2ProfanityFilter` listen-v2 enum
 *   - `ListenV2TurnInfo` word `start`/`end` being OPTIONAL
 *
 * The `@ts-expect-error` lines and typed object literals here are compile-time
 * assertions; they are gated by `make typecheck-tests` (tsconfig.typecheck.json),
 * not by vitest (which strips types at runtime).
 */
describe("2026-06-16 regen constraints & compat shims", () => {
    describe("ListenV2CloseStream", () => {
        it('serializes `type` to the literal "CloseStream"', () => {
            const msg: Deepgram.listen.v2.ListenV2CloseStream = { type: "CloseStream" };
            expect(JSON.parse(JSON.stringify(msg))).toEqual({ type: "CloseStream" });
        });

        it('Type namespace exposes ONLY "CloseStream" (the only valid v2 value)', () => {
            expect(Deepgram.listen.v2.ListenV2CloseStream.Type.CloseStream).toBe("CloseStream");

            // Finalize/KeepAlive are v1 control messages and were never valid on v2. An
            // earlier shim wrongly copied them from v1; they must NOT be present here.
            expect(Object.keys(Deepgram.listen.v2.ListenV2CloseStream.Type)).toEqual(["CloseStream"]);
            expect((Deepgram.listen.v2.ListenV2CloseStream.Type as Record<string, string>).Finalize).toBeUndefined();
            expect((Deepgram.listen.v2.ListenV2CloseStream.Type as Record<string, string>).KeepAlive).toBeUndefined();
        });
    });

    describe("DeepgramListenProviderV2 language_hints", () => {
        it("language_hints (string[]) round-trips through JSON", () => {
            const provider: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hints: ["en", "es"],
            };
            const roundTripped = JSON.parse(JSON.stringify(provider)) as DeepgramListenProviderV2;
            expect(roundTripped.language_hints).toEqual(["en", "es"]);
        });

        it("deprecated `language_hint` field still compiles for both string and string[]", () => {
            // The singular field was never honored by the API; it is retained only
            // so pre-rename call sites keep compiling. Prefer `language_hints`.
            const single: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hint: "en",
            };
            const multi: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hint: ["en", "es"],
            };
            expect(single.language_hint).toBe("en");
            expect(multi.language_hint).toEqual(["en", "es"]);
        });
    });

    describe("ListenV2ProfanityFilter (new listen v2 enum)", () => {
        it("exposes True/False members and stays open to arbitrary strings", () => {
            const on: ListenV2ProfanityFilter = Deepgram.ListenV2ProfanityFilter.True;
            const off: ListenV2ProfanityFilter = Deepgram.ListenV2ProfanityFilter.False;
            const open: ListenV2ProfanityFilter = "custom";
            expect(on).toBe("true");
            expect(off).toBe("false");
            expect(open).toBe("custom");
        });
    });

    describe("ListenV2TurnInfo word timings are OPTIONAL", () => {
        it("a word item is valid WITH start/end", () => {
            const item: Deepgram.listen.v2.ListenV2TurnInfo.Words.Item = {
                word: "hello",
                confidence: 0.99,
                start: 0.1,
                end: 0.5,
            };
            expect(item.start).toBe(0.1);
            expect(item.end).toBe(0.5);
        });

        it("a word item is valid WITHOUT start/end (both optional)", () => {
            const item: Deepgram.listen.v2.ListenV2TurnInfo.Words.Item = {
                word: "hello",
                confidence: 0.99,
            };
            expect(item.start).toBeUndefined();
            expect(item.end).toBeUndefined();

            // A server payload that omits the timings entirely must still parse.
            const parsed = JSON.parse(
                JSON.stringify({ word: "hi", confidence: 1 }),
            ) as Deepgram.listen.v2.ListenV2TurnInfo.Words.Item;
            expect(parsed.word).toBe("hi");
            expect(parsed.start).toBeUndefined();
        });
    });
});

/**
 * Coverage for the surface added by the 2026-07-09 regeneration:
 *   - Flux end-of-turn tuning fields on `DeepgramListenProviderV2`
 *     (`eot_threshold`, `eager_eot_threshold`, `eot_timeout_ms`)
 *   - the agent `UpdateListen` / `ListenUpdated` message types
 *   - the new Speak v2 (Flux streaming TTS) message + option types
 *
 * As above, the typed literals double as compile-time assertions under
 * `make typecheck-tests`.
 */
describe("2026-07-09 regen constraints", () => {
    describe("DeepgramListenProviderV2 end-of-turn fields", () => {
        it("accepts eot_threshold / eager_eot_threshold / eot_timeout_ms and round-trips", () => {
            const provider: DeepgramListenProviderV2 = {
                type: "deepgram",
                version: "v2",
                model: "flux-general-en",
                eot_threshold: 0.8,
                eager_eot_threshold: 0.5,
                eot_timeout_ms: 4000,
            };
            const roundTripped = JSON.parse(JSON.stringify(provider)) as DeepgramListenProviderV2;
            expect(roundTripped.eot_threshold).toBe(0.8);
            expect(roundTripped.eager_eot_threshold).toBe(0.5);
            expect(roundTripped.eot_timeout_ms).toBe(4000);
        });
    });

    describe("Agent UpdateListen / ListenUpdated", () => {
        it("UpdateListen carries a v2 listen provider and serializes", () => {
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: {
                    provider: {
                        type: "deepgram",
                        version: "v2",
                        model: "flux-general-en",
                        eot_threshold: 0.7,
                    },
                },
            };
            const parsed = JSON.parse(JSON.stringify(msg)) as Deepgram.agent.AgentV1UpdateListen;
            expect(parsed.type).toBe("UpdateListen");
            expect(parsed.listen.provider.model).toBe("flux-general-en");
        });

        it("ListenUpdated is a plain confirmation message", () => {
            const msg: Deepgram.agent.AgentV1ListenUpdated = { type: "ListenUpdated" };
            expect(msg.type).toBe("ListenUpdated");
        });
    });

    describe("Speak v2 (Flux streaming TTS) types", () => {
        it("client messages have the expected literal `type` fields", () => {
            const speak: Deepgram.speak.SpeakV2Speak = { type: "Speak", text: "hi" };
            const flush: Deepgram.speak.SpeakV2Flush = { type: "Flush" };
            const close: Deepgram.speak.SpeakV2Close = { type: "Close" };
            expect([speak.type, flush.type, close.type]).toEqual(["Speak", "Flush", "Close"]);
        });

        it("option enums expose members and stay open to arbitrary strings", () => {
            const encoding: Deepgram.SpeakV2Encoding = Deepgram.SpeakV2Encoding.Linear16;
            const sampleRate: Deepgram.SpeakV2SampleRate = Deepgram.SpeakV2SampleRate.TwentyFourThousand;
            // SpeakV2Model is an open string type
            const model: Deepgram.SpeakV2Model = "flux-alexis-en";
            expect(encoding).toBe("linear16");
            expect(sampleRate).toBe("24000");
            expect(model).toBe("flux-alexis-en");
        });

        it("SpeakV2Error.Code enum is open-ended", () => {
            const known: Deepgram.speak.SpeakV2Error.Code = Deepgram.speak.SpeakV2Error.Code.Net0000;
            const open: Deepgram.speak.SpeakV2Error.Code = "SOME-CUSTOM-CODE";
            expect(known).toBe("NET-0000");
            expect(open).toBe("SOME-CUSTOM-CODE");
        });
    });
});

/**
 * Coverage for the surface added by the 2026-07-31 regeneration:
 *   - `AgentV1UpdateListen.Listen.provider` back-compat shim (the regen repointed it
 *     at a union whose variants REQUIRE the `version` discriminant, which broke
 *     callers that omitted it)
 *   - the new listen-v2 `ForceEndTurn` message and `redact` option
 *   - `ListenV2TurnInfo.trigger` (open enum, optional)
 *   - `diarize_info` on the listen-v1 response metadata
 *
 * As above, the typed literals double as compile-time assertions under
 * `make typecheck-tests`.
 */
describe("2026-07-31 regen constraints", () => {
    describe("AgentV1UpdateListen provider back-compat", () => {
        it("accepts a v2 provider WITHOUT the `version` discriminant (the shim)", () => {
            // This is the exact shape that regressed: on the raw generator output both
            // union variants require `version`, so omitting it failed with TS2322.
            // The pre-existing `AgentV1UpdateListen` test below passes `version: "v2"`
            // explicitly, which is why it did not catch the break.
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", model: "flux-general-en" } },
            };
            const parsed = JSON.parse(JSON.stringify(msg)) as Deepgram.agent.AgentV1UpdateListen;
            expect(parsed.listen.provider).toEqual({ type: "deepgram", model: "flux-general-en" });
            // No `version` key is injected — the shim is compile-compat only.
            expect("version" in parsed.listen.provider).toBe(false);
        });

        it("still accepts the explicit v1 and v2 discriminated forms", () => {
            const v1: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", version: "v1", model: "nova-3", language: "en" } },
            };
            const v2: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", version: "v2", model: "flux-general-en" } },
            };
            expect(v1.listen.provider.model).toBe("nova-3");
            expect(v2.listen.provider.model).toBe("flux-general-en");
        });

        it("keeps `model` reading as a required string (not string | undefined)", () => {
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", model: "flux-general-en" } },
            };
            // Compile-time assertion: the V1 arm of the generated union declares
            // `model?`, which would widen this to `string | undefined`.
            const model: string = msg.listen.provider.model;
            expect(model).toBe("flux-general-en");
        });

        it("keeps the V2-only tuning fields READABLE off provider", () => {
            // Property access on a union requires the property on every arm, so these
            // reads broke with TS2339 once the V1 arm (which lacks them) was introduced.
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: {
                    provider: {
                        type: "deepgram",
                        model: "flux-general-multi",
                        eot_threshold: 0.7,
                        eager_eot_threshold: 0.4,
                        eot_timeout_ms: 4000,
                        language_hints: ["en", "es"],
                        keyterms: ["Deepgram"],
                    },
                },
            };
            const p = msg.listen.provider;
            expect([p.eot_threshold, p.eager_eot_threshold, p.eot_timeout_ms]).toEqual([0.7, 0.4, 4000]);
            expect(p.language_hints).toEqual(["en", "es"]);
            expect(p.keyterms).toEqual(["Deepgram"]);
        });
    });

    describe("listen v2 ForceEndTurn", () => {
        it('has the literal "ForceEndTurn" type and serializes', () => {
            const msg: Deepgram.listen.v2.ListenV2ForceEndTurn = { type: "ForceEndTurn" };
            expect(JSON.parse(JSON.stringify(msg))).toEqual({ type: "ForceEndTurn" });
        });
    });

    describe("ListenV2Redact", () => {
        it("exposes numbers/aggressive_numbers and stays open to arbitrary strings", () => {
            const numbers: Deepgram.ListenV2Redact = Deepgram.ListenV2Redact.Numbers;
            const aggressive: Deepgram.ListenV2Redact = Deepgram.ListenV2Redact.AggressiveNumbers;
            const open: Deepgram.ListenV2Redact = "something-new";
            expect([numbers, aggressive, open]).toEqual(["numbers", "aggressive_numbers", "something-new"]);
        });
    });

    describe("ListenV2TurnInfo.trigger", () => {
        it("is optional and open to unrecognized values", () => {
            const withTrigger: Pick<Deepgram.listen.v2.ListenV2TurnInfo, "trigger"> = { trigger: "manual" };
            const withoutTrigger: Pick<Deepgram.listen.v2.ListenV2TurnInfo, "trigger"> = {};
            // Documented as an open enum: clients must tolerate unknown values.
            const future: Pick<Deepgram.listen.v2.ListenV2TurnInfo, "trigger"> = { trigger: "some-future-trigger" };
            expect(withTrigger.trigger).toBe("manual");
            expect(withoutTrigger.trigger).toBeUndefined();
            expect(future.trigger).toBe("some-future-trigger");
        });
    });

    describe("listen v1 diarize_info", () => {
        it("is optional on the response metadata and carries an open `arch` enum", () => {
            const meta: Pick<Deepgram.ListenV1ResponseMetadata, "diarize_info"> = {
                diarize_info: { model_uuid: "uuid-1", arch: "v2" },
            };
            const omitted: Pick<Deepgram.ListenV1ResponseMetadata, "diarize_info"> = {};
            expect(meta.diarize_info?.arch).toBe("v2");
            expect(omitted.diarize_info).toBeUndefined();
        });
    });
});
