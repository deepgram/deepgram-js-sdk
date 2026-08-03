import { describe, it, expect } from "vitest";
import { Deepgram } from "../../src";

// AgentV1LatencyReport is exported under the `Deepgram.agent.*` namespace, not
// the top-level barrel — mirror compat-aliases.test.ts and alias via import-equals.
import AgentV1LatencyReport = Deepgram.agent.AgentV1LatencyReport;

/**
 * Regression test for the `stt_latency` field on AgentV1LatencyReport.
 *
 * The 2026-07-20 spec removal of `stt_latency` was reverted upstream: the
 * 2026-07-31 regen emits `stt_latency?: number` natively again, so the hand-added
 * back-compat shim (and its .fernignore freeze) was dropped — Fern owns the field.
 * This test stays as a guard: if a future regen removes the field or narrows its
 * type, the assertions below break and flag the back-compat regression before it
 * ships.
 *
 * TypeScript types are erased at runtime, so the compile-time assertions below
 * are the real guard — this file is compiled against `src` by
 * `make typecheck-tests` (tsconfig.typecheck.json), so any drift (field dropped,
 * or its type narrowed) fails the type-check gate.
 */

// Compile-time identity check: `stt_latency` remains an optional `number` field.
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type SttLatencyType = AgentV1LatencyReport["stt_latency"];
const _sttStillOptionalNumber: Equals<SttLatencyType, number | undefined> = true;

describe("AgentV1LatencyReport.stt_latency backward-compat shim", () => {
    it("compiles: stt_latency is a readable optional number field", () => {
        expect(_sttStillOptionalNumber).toBe(true);
    });

    it("reads as undefined when the server omits it (spec removal)", () => {
        const report: AgentV1LatencyReport = { type: "LatencyReport" };
        expect(report.stt_latency).toBeUndefined();
    });

    it("still accepts a value at the type + runtime level", () => {
        const report: AgentV1LatencyReport = { type: "LatencyReport", stt_latency: 0.42 };
        expect(report.stt_latency).toBe(0.42);
    });
});
