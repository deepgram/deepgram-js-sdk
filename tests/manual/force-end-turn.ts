/**
 * Manual live-API verification for Listen V2 force-end-turn, new in the 2026-08-19 regen.
 *
 * `ForceEndTurn` ends the current turn on demand instead of waiting for Flux to decide.
 * Paired with `eot_threshold: 1.0` — which this regen widened the valid range to admit —
 * it lets the caller own turn boundaries completely.
 *
 * Neither half can be proven by the unit tests, which drive a fake transport: those pin
 * the frame the SDK emits, not what the server does with it. This script covers the rest:
 *
 *   1. ForceEndTurn ends an in-progress turn, and the resulting EndOfTurn reports
 *      trigger="manual" while the socket stays open for the next turn
 *   2. eot_threshold=1.0 suppresses natural end-of-turn entirely, so ForceEndTurn becomes
 *      the only thing that can close a turn
 *
 * `ForceEndTurn` is gated per deployment. Where it is not enabled the server replies
 * `UNPARSABLE_CLIENT_MESSAGE` ("not enabled on this deployment") and closes the socket;
 * this script reports that as a SKIP rather than a failure. Point it at a deployment that
 * has the feature with DEEPGRAM_BASE_URL.
 *
 * Requires DEEPGRAM_API_KEY. Run with:
 *
 *     pnpm tsx tests/manual/force-end-turn.ts
 *     DEEPGRAM_BASE_URL=https://api.staging.deepgram.com pnpm tsx tests/manual/force-end-turn.ts
 */

import { readFile } from "node:fs/promises";
import { DeepgramClient } from "../../src";

const AUDIO_PATH = "./examples/spacewalk.wav";
const SAMPLE_RATE = 44100;
const WAV_HEADER_BYTES = 44;
const CHUNK_BYTES = (SAMPLE_RATE / 10) * 2; // 100ms of 16-bit mono PCM

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface TurnInfo {
    type: string;
    event?: string;
    turn_index?: number;
    trigger?: string;
    end_of_turn_confidence?: number;
    transcript?: string;
    code?: string;
    description?: string;
}

interface RunResult {
    turns: TurnInfo[];
    endOfTurns: TurnInfo[];
    gated: boolean;
    error?: string;
}

/**
 * Streams audio at /v2/listen, optionally forcing the turn to end once one is underway.
 * Returns every TurnInfo seen so the caller can assert on the sequence.
 */
async function run(
    client: DeepgramClient,
    { force, eotThreshold, maxChunks }: { force: boolean; eotThreshold?: number; maxChunks: number },
): Promise<RunResult> {
    const pcm = await readFile(AUDIO_PATH);
    const turns: TurnInfo[] = [];
    const endOfTurns: TurnInfo[] = [];
    let gated = false;
    let error: string | undefined;
    let closed = false;
    let started = false;

    const socket = await client.listen.v2.createConnection({
        model: "flux-general-en",
        encoding: "linear16",
        sample_rate: SAMPLE_RATE,
        ...(eotThreshold !== undefined ? { eot_threshold: eotThreshold } : {}),
    });

    socket.on("close", () => {
        closed = true;
    });
    socket.on("error", (e: Error) => {
        error = e.message;
    });
    socket.on("message", (message: TurnInfo) => {
        if (message.type === "TurnInfo") {
            turns.push(message);
            if (message.event === "StartOfTurn") started = true;
            if (message.event === "EndOfTurn") endOfTurns.push(message);
        } else if (message.code === "UNPARSABLE_CLIENT_MESSAGE") {
            gated = true;
            error = `${message.code}: ${message.description}`;
        } else if (message.code) {
            error = `${message.code}: ${message.description}`;
        }
    });

    // createConnection() returns an unconnected socket; connect() opens it.
    socket.connect();
    await socket.waitForOpen();

    let offset = WAV_HEADER_BYTES;
    let forced = false;
    for (let i = 0; i < maxChunks && offset < pcm.length && !closed; i++) {
        const end = Math.min(offset + CHUNK_BYTES, pcm.length);
        socket.sendMedia(pcm.subarray(offset, end));
        offset = end;
        await sleep(100);

        // Force only once a turn is genuinely in progress — forcing before StartOfTurn
        // would have no open turn to end, and would prove nothing.
        if (force && !forced && started && i >= 20) {
            socket.sendForceEndTurn({ type: "ForceEndTurn" });
            forced = true;
        }
    }

    await sleep(2000);
    if (!closed) {
        socket.sendCloseStream({ type: "CloseStream" });
        await sleep(500);
    }
    socket.close();

    return { turns, endOfTurns, gated, error };
}

async function main(): Promise<void> {
    console.log("Listen V2 force-end-turn live verification");

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.log("  SKIP: DEEPGRAM_API_KEY not set");
        return;
    }

    // The v2 socket URL comes from environment.production, a wss:// origin — passing an
    // https:// baseUrl would hand the socket a URL it can never open.
    const host = process.env.DEEPGRAM_BASE_URL?.replace(/^https?:\/\//, "") ?? "api.deepgram.com";
    const client = new DeepgramClient({
        apiKey,
        environment: {
            base: `https://${host}`,
            production: `wss://${host}`,
            agent: `wss://${host}`,
            agentRest: `https://${host}`,
        },
    });
    console.log(`  Target: wss://${host}`);

    console.log("\n[1/2] ForceEndTurn ends an in-progress turn with trigger=manual");
    const forced = await run(client, { force: true, maxChunks: 60 });

    if (forced.gated) {
        console.log("  SKIP: ForceEndTurn is not enabled on this deployment");
        console.log(`        (${forced.error})`);
        console.log("        Set DEEPGRAM_BASE_URL to a deployment that has the feature.");
        return;
    }
    if (forced.error) {
        throw new Error(forced.error);
    }

    const manual = forced.endOfTurns.find((t) => t.trigger === "manual");
    if (!manual) {
        throw new Error(
            `expected an EndOfTurn with trigger="manual", saw ${
                forced.endOfTurns.map((t) => t.trigger ?? "<absent>").join(", ") || "no EndOfTurn at all"
            }`,
        );
    }
    console.log(`  PASS: EndOfTurn trigger=manual (end_of_turn_confidence=${manual.end_of_turn_confidence})`);
    console.log(`        transcript: "${manual.transcript}"`);

    // A model-detected end carries high confidence. A forced end arrives regardless, so a
    // low value here is the evidence the turn ended because we asked rather than because
    // Flux decided it was over.
    if ((manual.end_of_turn_confidence ?? 1) > 0.5) {
        console.log("  WARN: confidence is high enough that natural detection may have ended this turn");
    }

    // The connection must survive a forced end — the turn index advances and transcription
    // continues, rather than the socket closing.
    const laterTurns = forced.turns.filter((t) => (t.turn_index ?? 0) > (manual.turn_index ?? 0));
    if (laterTurns.length === 0) {
        throw new Error("expected the stream to continue into a new turn after ForceEndTurn");
    }
    console.log(`  PASS: stream continued into turn ${laterTurns[0].turn_index} (${laterTurns.length} later events)`);

    console.log("\n[2/2] eot_threshold=1.0 suppresses natural end-of-turn");
    const suppressed = await run(client, { force: false, eotThreshold: 1.0, maxChunks: 300 });
    if (suppressed.error) {
        throw new Error(suppressed.error);
    }
    if (suppressed.endOfTurns.length > 0) {
        throw new Error(
            `expected no natural EndOfTurn at eot_threshold=1.0, saw ${suppressed.endOfTurns.length} ` +
                `(triggers: ${suppressed.endOfTurns.map((t) => t.trigger ?? "<absent>").join(", ")})`,
        );
    }
    console.log(`  PASS: ${suppressed.turns.length} TurnInfo events, 0 EndOfTurn — natural detection suppressed`);
    console.log("        so ForceEndTurn is the only way to close a turn at this threshold");

    console.log("\nForce-end-turn live verification completed.");
}

main().catch((e: unknown) => {
    console.error(`  FAIL: ${(e as Error).message}`);
    process.exitCode = 1;
});
