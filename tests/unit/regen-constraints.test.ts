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

        it("pins the complete SpeakV2Encoding member set (guards a regen dropping a value)", () => {
            // linear16 is the only streaming-compatible member exposed as an enum;
            // mulaw/alaw round out the raw-audio set. Compressed encodings (mp3, etc.)
            // are batch-only and intentionally NOT in this enum.
            expect(Deepgram.SpeakV2Encoding).toEqual({
                Linear16: "linear16",
                Mulaw: "mulaw",
                Alaw: "alaw",
            });
            // Open union: an unknown string is still assignable.
            const custom: Deepgram.SpeakV2Encoding = "future-codec";
            expect(custom).toBe("future-codec");
        });

        it("pins the complete SpeakV2SampleRate member set (guards a regen dropping a value)", () => {
            expect(Deepgram.SpeakV2SampleRate).toEqual({
                EightThousand: "8000",
                SixteenThousand: "16000",
                TwentyFourThousand: "24000",
                ThirtyTwoThousand: "32000",
                FortyFourThousandOneHundred: "44100",
                FortyEightThousand: "48000",
            });
            // Open union: an arbitrary rate string is still assignable at the type level.
            const custom: Deepgram.SpeakV2SampleRate = "96000";
            expect(custom).toBe("96000");
        });

        it("SpeakV2Error.Code enum is open-ended", () => {
            const known: Deepgram.speak.SpeakV2Error.Code = Deepgram.speak.SpeakV2Error.Code.Net0000;
            const open: Deepgram.speak.SpeakV2Error.Code = "SOME-CUSTOM-CODE";
            expect(known).toBe("NET-0000");
            expect(open).toBe("SOME-CUSTOM-CODE");
        });
    });
});
