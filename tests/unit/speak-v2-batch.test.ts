/**
 * Hand-written coverage for the Flux TTS batch (REST) endpoint: `speak.v2.audio.generate()`
 * (POST /v2/speak).
 *
 * The Fern generator did NOT emit a REST wire test for this endpoint, so this fills that
 * gap. A local http server captures the outgoing request and returns binary
 * audio, letting us assert:
 *   - the request shape (POST /v2/speak, `model`/`encoding` in the query, `text` in the JSON body);
 *   - that the binary audio response is surfaced via `arrayBuffer()`;
 *   - that integer `sample_rate` / `bit_rate` serialize WITHOUT a decimal. stem parses these as a
 *     nonzero u32 and rejects `"24000.0"`, so this guards the spec's `type: integer` typing against
 *     a future regen silently reverting it to a float. Frozen in .fernignore.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import http from "node:http";
import { DeepgramClient } from "../../src";

interface CapturedRequest {
    method: string;
    path: string;
    query: URLSearchParams;
    body: string;
}

describe("Speak V2 batch (POST /v2/speak)", () => {
    let server: http.Server;
    const port = 39_998;
    const baseUrl = `http://localhost:${port}`;
    const AUDIO = Buffer.from([0xff, 0xfb, 0x90, 0x00, 0x11, 0x22, 0x33, 0x44]);
    let last: CapturedRequest | undefined;

    const makeClient = () =>
        new DeepgramClient({
            apiKey: "test",
            maxRetries: 0,
            environment: { base: baseUrl, production: baseUrl, agent: baseUrl, agentRest: baseUrl },
        });

    beforeAll(async () => {
        server = http.createServer((req, res) => {
            const url = new URL(req.url ?? "/", baseUrl);
            const chunks: Buffer[] = [];
            req.on("data", (c) => chunks.push(c as Buffer));
            req.on("end", () => {
                last = {
                    method: req.method ?? "",
                    path: url.pathname,
                    query: url.searchParams,
                    body: Buffer.concat(chunks).toString("utf8"),
                };
                res.writeHead(200, { "Content-Type": "audio/mpeg" });
                res.end(AUDIO);
            });
        });
        await new Promise<void>((resolve) => server.listen(port, resolve));
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
    });

    beforeEach(() => {
        last = undefined;
    });

    it("issues POST /v2/speak with model in query + text in body, and returns the audio bytes", async () => {
        const response = await makeClient().speak.v2.audio.generate({
            model: "flux-alexis-en",
            text: "Hello from the batch endpoint.",
            encoding: "mp3",
        });
        const audio = new Uint8Array(await response.arrayBuffer());

        expect(last?.method).toBe("POST");
        expect(last?.path).toBe("/v2/speak");
        expect(last?.query.get("model")).toBe("flux-alexis-en");
        expect(last?.query.get("encoding")).toBe("mp3");
        expect(JSON.parse(last?.body ?? "{}")).toEqual({ text: "Hello from the batch endpoint." });
        expect(audio).toEqual(new Uint8Array(AUDIO));
    });

    it("serializes integer sample_rate/bit_rate without a decimal (guards the type: integer fix)", async () => {
        await makeClient().speak.v2.audio.generate({
            model: "flux-alexis-en",
            text: "hi",
            encoding: "linear16",
            sample_rate: 24000,
            bit_rate: 48000,
        });

        expect(last?.query.get("sample_rate")).toBe("24000");
        expect(last?.query.get("bit_rate")).toBe("48000");
        // Must NOT be "24000.0" — stem rejects a non-integer with "expected a nonzero u32".
        expect(last?.query.get("sample_rate")).not.toContain(".");
        expect(last?.query.get("bit_rate")).not.toContain(".");
    });
});
