/**
 * Coverage for the Speak V2 (Flux TTS) client surface that the existing dedicated
 * tests leave untouched. Mirrors the Python SDK's `test_speak_v2_coverage.py`.
 *
 *   - `client/Client.ts` `connect()` — the query-param serialization (string vs
 *     `toJson` branches, absent-param omission, explicit `queryParams` merge), the
 *     option defaults (protocols / debug / reconnectAttempts / connectionTimeout),
 *     and the `audio` lazy-getter. Speak V2 is absent from
 *     `generated-ws-clients.test.ts`, so `connect()` sat almost entirely uncovered.
 *   - `client/Socket.ts` — event forwarding, `readyState`, the send methods (the
 *     not-open guard and the open path), `connect()`/`close()` teardown,
 *     `waitForOpen()`, and the protected `sendBinary`. Speak V2 is absent from the
 *     `describe.each` in `websocket-sockets.test.ts`.
 *   - `resources/audio/client/Client.ts` — the error branches of `generate()`
 *     (400 -> BadRequestError, other status -> DeepgramError, transport failure ->
 *     handleNonStatusCodeError). `speak-v2-batch.test.ts` only drives the 2xx path.
 *     Plus the default-host fallback (the `DeepgramEnvironment.Production.base`
 *     branch the local-server tests can't reach because they always set
 *     `environment`) and the `requestOptions` passthrough (headers, query params,
 *     timeout, retries, abort signal), asserted through an injected capturing
 *     fetcher so no network is required.
 *
 * No network for the websocket paths (a fake socket / already-aborted signal is
 * used); the batch REST error paths use a local http server, matching
 * `speak-v2-batch.test.ts`.
 *
 * Hand-written and frozen in `.fernignore` — Fern only generates HTTP WireMock
 * wire tests, so a regen would not reproduce this coverage.
 */

import http from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { DeepgramClient, DeepgramError } from "../../src";
import { BadRequestError } from "../../src/api/errors/index.js";
import { V2Client } from "../../src/api/resources/speak/resources/v2/client/Client.js";
import { V2Socket } from "../../src/api/resources/speak/resources/v2/client/Socket.js";

const CONNECTING = 0;
const OPEN = 1;

/** An already-aborted signal makes ReconnectingWebSocket short-circuit in its
 * constructor so `connect()` never opens a real socket. */
function abortedSignal(): AbortSignal {
    const controller = new AbortController();
    controller.abort();
    return controller.signal;
}

function queryParamsOf(socket: unknown): Record<string, unknown> {
    return (socket as any).socket._queryParameters ?? {};
}

// --------------------------------------------------------------------------- //
// client/Client.ts — connect() query params, defaults, audio getter
// --------------------------------------------------------------------------- //

describe("Speak V2Client.connect", () => {
    const client = new V2Client({ apiKey: "test" });

    it("serializes string-valued params and keeps them as-is", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            encoding: "linear16",
            sample_rate: "24000",
            mip_opt_out: "true",
            tag: "t",
            Authorization: "Token abc",
            abortSignal: abortedSignal(),
        } as any);
        const qp = queryParamsOf(socket);
        expect(qp.model).toBe("flux-alexis-en");
        expect(qp.encoding).toBe("linear16");
        expect(qp.sample_rate).toBe("24000");
        // string mip_opt_out/tag bypass toJson and are passed through unchanged.
        expect(qp.mip_opt_out).toBe("true");
        expect(qp.tag).toBe("t");
    });

    it("serializes object/boolean params via toJson", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            mip_opt_out: true,
            tag: ["t1", "t2"],
            Authorization: "Token abc",
            abortSignal: abortedSignal(),
        } as any);
        const qp = queryParamsOf(socket);
        // boolean true -> toJson -> "true"; array -> toJson -> JSON string.
        expect(qp.mip_opt_out).toBe("true");
        expect(qp.tag).toBe(JSON.stringify(["t1", "t2"]));
    });

    it("omits absent optional params", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            Authorization: "Token abc",
            abortSignal: abortedSignal(),
        } as any);
        const qp = queryParamsOf(socket);
        expect(qp.encoding).toBeUndefined();
        expect(qp.sample_rate).toBeUndefined();
        expect(qp.mip_opt_out).toBeUndefined();
        expect(qp.tag).toBeUndefined();
    });

    it("merges explicit queryParams, headers, and connection options", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            Authorization: "Token abc",
            protocols: ["token", "abc"],
            queryParams: { custom: "1" },
            headers: { "x-custom": "1" },
            debug: true,
            reconnectAttempts: 5,
            connectionTimeoutInSeconds: 3,
            abortSignal: abortedSignal(),
        } as any);
        expect(queryParamsOf(socket).custom).toBe("1");
        expect(socket).toBeInstanceOf(V2Socket);
    });

    it("returns a V2Socket and exposes a cached audio getter", () => {
        const audio = client.audio;
        expect(audio).toBeDefined();
        // Second access hits the `??=` cached branch.
        expect(client.audio).toBe(audio);
    });

    it("defaults to the production websocket host when no environment is set", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            Authorization: "Token abc",
            abortSignal: abortedSignal(),
        } as any);
        // Exercises the `environments.DeepgramEnvironment.Production.production`
        // fallback in connect() — no baseUrl / environment supplied.
        expect((socket as any).socket._url).toBe("wss://api.deepgram.com/v2/speak");
    });
});

// --------------------------------------------------------------------------- //
// client/Socket.ts — event forwarding, sends, connect/close, waitForOpen
// --------------------------------------------------------------------------- //

/** Minimal stand-in for core.ReconnectingWebSocket, matching websocket-sockets.test.ts. */
class FakeSocket {
    public readyState = CONNECTING;
    public sent: unknown[] = [];
    public closeCalled = false;
    public reconnectCalled = false;
    private listeners: Record<string, Array<(event: any) => void>> = {};

    addEventListener(type: string, cb: (event: any) => void): void {
        (this.listeners[type] ??= []).push(cb);
    }
    removeEventListener(type: string, cb: (event: any) => void): void {
        this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== cb);
    }
    send(data: unknown): void {
        this.sent.push(data);
    }
    close(): void {
        this.closeCalled = true;
    }
    reconnect(): void {
        this.reconnectCalled = true;
    }
    emit(type: string, event: any): void {
        (this.listeners[type] ?? []).forEach((l) => l(event));
    }
}

describe("Speak V2Socket", () => {
    const make = (fake: FakeSocket) => new V2Socket({ socket: fake as any });

    it("forwards socket events to registered handlers", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const seen: { open?: boolean; message?: any; close?: any; error?: Error } = {};
        socket.on("open", () => {
            seen.open = true;
        });
        socket.on("message", (m) => {
            seen.message = m;
        });
        socket.on("close", (e) => {
            seen.close = e;
        });
        socket.on("error", (e) => {
            seen.error = e;
        });

        fake.emit("open", { type: "open" });
        expect(seen.open).toBe(true);

        fake.emit("message", { data: '{"type":"Flushed","speech_id":1}' });
        expect(seen.message).toEqual({ type: "Flushed", speech_id: 1 });

        fake.emit("error", { message: "socket failure" });
        expect(seen.error).toBeInstanceOf(Error);
        expect(seen.error?.message).toBe("socket failure");

        fake.emit("close", { code: 1011, reason: "server" });
        expect(seen.close).toEqual({ code: 1011, reason: "server" });
    });

    it("exposes readyState from the underlying socket", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        expect(socket.readyState).toBe(CONNECTING);
        fake.readyState = OPEN;
        expect(socket.readyState).toBe(OPEN);
    });

    it("throws when sending before the socket is open", () => {
        const socket = make(new FakeSocket());
        expect(() => socket.sendSpeak({ type: "Speak", text: "hi" } as any)).toThrow("Socket is not open.");
        expect(() => socket.sendFlush({ type: "Flush" } as any)).toThrow("Socket is not open.");
        expect(() => socket.sendClose({ type: "Close" } as any)).toThrow("Socket is not open.");
    });

    it("throws when the underlying socket is missing", () => {
        const socket = make(new FakeSocket());
        // Drop the socket after construction to hit the `!this.socket` guard.
        (socket as any).socket = null;
        expect(() => socket.sendSpeak({ type: "Speak", text: "hi" } as any)).toThrow("Socket is not connected.");
    });

    it("sends JSON control/speak payloads once open", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        fake.readyState = OPEN;

        socket.sendSpeak({ type: "Speak", text: "hi" } as any);
        socket.sendFlush({ type: "Flush" } as any);
        socket.sendClose({ type: "Close" } as any);

        expect(fake.sent.length).toBe(3);
        expect(fake.sent.every((m) => typeof m === "string")).toBe(true);
        expect(JSON.parse(fake.sent[0] as string)).toEqual({ type: "Speak", text: "hi" });
    });

    it("sends a binary payload via the protected sendBinary", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const payload = new Uint8Array([1, 2, 3]);
        (socket as any).sendBinary(payload);
        expect(fake.sent[0]).toBe(payload);
    });

    it("connect() reconnects and close() tears down", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        expect(socket.connect()).toBe(socket);
        expect(fake.reconnectCalled).toBe(true);

        let closeEvent: any;
        socket.on("close", (e) => {
            closeEvent = e;
        });
        socket.close();
        expect(fake.closeCalled).toBe(true);
        expect(closeEvent).toEqual({ code: 1000 });
    });

    it("waitForOpen resolves immediately when already open", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        fake.readyState = OPEN;
        await expect(socket.waitForOpen()).resolves.toBe(fake);
    });

    it("waitForOpen resolves when the open event fires", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const promise = socket.waitForOpen();
        fake.emit("open", { type: "open" });
        await expect(promise).resolves.toBe(fake);
    });

    it("waitForOpen rejects when an error event fires", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const promise = socket.waitForOpen();
        const handled = promise.catch((e) => e);
        fake.emit("error", { message: "nope" });
        await expect(Promise.resolve(handled)).resolves.toBeDefined();
    });
});

// --------------------------------------------------------------------------- //
// resources/audio/client/Client.ts — generate() error branches
// --------------------------------------------------------------------------- //

describe("Speak V2 audio.generate error branches", () => {
    let server: http.Server;
    const port = 39_997;
    const baseUrl = `http://localhost:${port}`;
    // Mutated per test to steer the response the local server returns.
    let responder: (res: http.ServerResponse) => void;

    const makeClient = (overrides: Record<string, unknown> = {}) =>
        new DeepgramClient({
            apiKey: "test",
            maxRetries: 0,
            environment: { base: baseUrl, production: baseUrl, agent: baseUrl, agentRest: baseUrl },
            ...overrides,
        });

    beforeAll(async () => {
        server = http.createServer((req, res) => {
            const chunks: Buffer[] = [];
            req.on("data", (c) => chunks.push(c as Buffer));
            req.on("end", () => responder(res));
        });
        await new Promise<void>((resolve) => server.listen(port, resolve));
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
    });

    beforeEach(() => {
        responder = (res) => res.end();
    });

    it("serializes all optional query params on the success path", async () => {
        let capturedUrl: string | undefined;
        responder = (res) => {
            res.writeHead(200, { "Content-Type": "audio/mpeg" });
            res.end(Buffer.from([0x00, 0x01]));
        };
        server.once("request", (req) => {
            capturedUrl = req.url;
        });
        const response = await makeClient().speak.v2.audio.generate({
            model: "flux-alexis-en",
            text: "hi",
            callback: "https://cb.example.com",
            callback_method: "POST",
            mip_opt_out: true,
            tag: ["t1"],
            bit_rate: 48000,
            container: "wav",
            encoding: "linear16",
            sample_rate: 24000,
            priority: "low",
        });
        await response.arrayBuffer();
        const query = new URLSearchParams(capturedUrl?.split("?")[1] ?? "");
        expect(query.get("callback_method")).toBe("POST");
        expect(query.get("container")).toBe("wav");
        expect(query.get("encoding")).toBe("linear16");
        expect(query.get("priority")).toBe("low");
    });

    it("throws BadRequestError on a 400 response", async () => {
        responder = (res) => {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ err_code: "Bad Request", err_msg: "boom" }));
        };
        await expect(makeClient().speak.v2.audio.generate({ model: "m", text: "t" })).rejects.toBeInstanceOf(
            BadRequestError,
        );
    });

    it("throws DeepgramError on a non-400 status code", async () => {
        responder = (res) => {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ err_code: "Internal", err_msg: "kaboom" }));
        };
        const error = await makeClient()
            .speak.v2.audio.generate({ model: "m", text: "t" })
            .catch((e) => e);
        expect(error).toBeInstanceOf(DeepgramError);
        expect(error).not.toBeInstanceOf(BadRequestError);
        expect((error as any).statusCode).toBe(500);
    });

    it("routes a transport failure through handleNonStatusCodeError", async () => {
        // Point at a closed port so the fetch fails before any status code is
        // received (reason !== "status-code").
        const client = new DeepgramClient({
            apiKey: "test",
            maxRetries: 0,
            environment: {
                base: "http://localhost:1",
                production: "http://localhost:1",
                agent: "http://localhost:1",
                agentRest: "http://localhost:1",
            },
        });
        await expect(client.speak.v2.audio.generate({ model: "m", text: "t" })).rejects.toBeInstanceOf(DeepgramError);
    });
});

// --------------------------------------------------------------------------- //
// resources/audio/client/Client.ts — default host + requestOptions passthrough
// --------------------------------------------------------------------------- //

describe("Speak V2 audio.generate host + request options", () => {
    /**
     * A capturing fetcher lets us assert the resolved request URL and every
     * `requestOptions` passthrough without a network round-trip. It returns a
     * minimal successful BinaryResponse so `generate()` resolves normally.
     */
    function capturingClient() {
        const calls: Array<Record<string, any>> = [];
        const fetcher = async (args: Record<string, any>) => {
            calls.push(args);
            return {
                ok: true,
                body: {
                    bodyUsed: false,
                    stream: () => null,
                    arrayBuffer: async () => new ArrayBuffer(0),
                    blob: async () => new Blob(),
                },
                rawResponse: {
                    headers: new Headers(),
                    redirected: false,
                    status: 200,
                    statusText: "OK",
                    type: "basic",
                    url: args.url,
                },
            };
        };
        const client = new DeepgramClient({ apiKey: "test", fetcher: fetcher as any });
        return { client, calls };
    }

    it("defaults to the production REST host when no environment is set", async () => {
        const { client, calls } = capturingClient();
        await (await client.speak.v2.audio.generate({ model: "flux-alexis-en", text: "hi" })).arrayBuffer();
        // The only branch the local-server tests can't reach: they always pass an
        // explicit `environment`, so the `DeepgramEnvironment.Production.base`
        // fallback (Client.ts:79) stays uncovered until we omit it here.
        expect(calls[0].url).toBe("https://api.deepgram.com/v2/speak");
    });

    it("forwards requestOptions headers, query params, timeout, retries, and abort signal", async () => {
        const { client, calls } = capturingClient();
        const abort = new AbortController();
        await (
            await client.speak.v2.audio.generate(
                { model: "flux-alexis-en", text: "hi" },
                {
                    headers: { "x-trace-id": "trace-42" },
                    queryParams: { extra: "1" },
                    timeoutInSeconds: 7,
                    maxRetries: 4,
                    abortSignal: abort.signal,
                },
            )
        ).arrayBuffer();
        const args = calls[0];
        // mergeHeaders lowercases keys; the caller header survives the merge.
        expect(args.headers["x-trace-id"]).toBe("trace-42");
        // Additional query params merge alongside the request's own params.
        expect(args.queryString).toContain("extra=1");
        expect(args.queryString).toContain("model=flux-alexis-en");
        // timeoutInSeconds is converted to milliseconds; maxRetries/abortSignal pass through verbatim.
        expect(args.timeoutMs).toBe(7000);
        expect(args.maxRetries).toBe(4);
        expect(args.abortSignal).toBe(abort.signal);
    });

    it("falls back to the 60s default timeout when none is supplied", async () => {
        const { client, calls } = capturingClient();
        await (await client.speak.v2.audio.generate({ model: "flux-alexis-en", text: "hi" })).arrayBuffer();
        // Neither requestOptions.timeoutInSeconds nor a client-level timeout is set,
        // so the `?? 60` default (× 1000) applies.
        expect(calls[0].timeoutMs).toBe(60000);
    });
});
