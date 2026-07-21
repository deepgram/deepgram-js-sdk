import { describe, it, expect } from "vitest";
import { Deepgram } from "../../src";

// AgentV1LatencyReport is exported under the `Deepgram.agent.*` namespace, not
// the top-level barrel — mirror compat-aliases.test.ts and alias via import-equals.
import AgentV1LatencyReport = Deepgram.agent.AgentV1LatencyReport;

/**
 * Regression test for the `stt_latency` backward-compat shim on
 * AgentV1LatencyReport.
 *
 * The API spec removed `stt_latency` from the LatencyReport schema
 * (deepgram-docs #1006). AgentV1LatencyReport is a server-emitted (read-only)
 * message, so we re-add the optional field by hand (frozen in .fernignore) to
 * keep `report.stt_latency` resolving instead of breaking existing readers at
 * compile time. Mirrors the Python SDK shim (deepgram-python-sdk#746).
 *
 * TypeScript types are erased at runtime, so the compile-time assertions below
 * are the real guard — this file is compiled against `src` by
 * `make typecheck-tests` (tsconfig.typecheck.json), so if the shim ever drifts
 * (field dropped, or its type narrowed) the type-check gate fails.
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
