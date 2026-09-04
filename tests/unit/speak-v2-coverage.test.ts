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
 * Nothing here depends on a fixed port or on a machine-level assumption about
 * which ports are closed. The websocket paths use a fake socket, an
 * already-aborted signal, or a capturing `transportFactory`; the REST error
 * branches use an injected fetcher that returns the exact `Fetcher` result shape
 * each branch dispatches on. The single real http server (for asserting query
 * serialization as it actually arrives over the wire) binds port `0` and lets the
 * OS assign a free port.
 *
 * Hand-written and frozen in `.fernignore` — Fern only generates HTTP WireMock
 * wire tests, so a regen would not reproduce this coverage.
 */

import http from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { DeepgramClient, DeepgramError, type DeepgramTransport } from "../../src";
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
    const params = (socket as any).socket?._queryParameters;
    // No `?? {}` fallback: a regen renaming this private must fail loudly rather
    // than silently hand back an empty object, which would satisfy every
    // `toBeUndefined()` assertion in the omission test below.
    if (params === undefined) {
        throw new Error("socket._queryParameters not found — generated internals may have changed");
    }
    return params;
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
        // boolean true -> toJson -> "true".
        expect(qp.mip_opt_out).toBe("true");
        // `tag` is documented as repeatable (SpeakV2Tag), whose wire form is
        // `tag=t1&tag=t2`. This *generated* client instead routes arrays through
        // toJson, so the exact string it produces is not a contract worth
        // freezing — asserting it would reject a generator fix that emits the
        // documented repeatable form. Assert only that both tags survive
        // serialization; the wire form is pinned on the public
        // `DeepgramClient.speak.v2` path below, which already gets it right.
        expect(String(qp.tag)).toContain("t1");
        expect(String(qp.tag)).toContain("t2");
    });

    it("omits absent optional params", async () => {
        const socket = await client.connect({
            model: "flux-alexis-en",
            Authorization: "Token abc",
            abortSignal: abortedSignal(),
        } as any);
        const qp = queryParamsOf(socket);
        // Positive anchor: without it every assertion below is trivially true of `{}`.
        expect(qp.model).toBe("flux-alexis-en");
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

    it("exposes a cached audio getter", () => {
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
// The encoded upgrade URL, observed through the public client
// --------------------------------------------------------------------------- //

describe("Speak V2 websocket upgrade URL", () => {
    /**
     * `transportFactory` is the supported hook that receives the fully encoded
     * upgrade URL, so it lets us assert the actual wire contract instead of the
     * generated client's private `_queryParameters` bag.
     */
    async function capturedUpgradeUrl(args: Record<string, unknown>): Promise<URL> {
        const urls: string[] = [];
        const client = new DeepgramClient({
            apiKey: "test",
            transportFactory: (url: string) => {
                urls.push(url);
                return {
                    send: () => undefined,
                    onOpen: () => undefined,
                    onMessage: () => undefined,
                    onError: () => undefined,
                    onClose: () => undefined,
                    isOpen: () => false,
                    close: () => undefined,
                } as DeepgramTransport;
            },
        } as any);
        const socket = await client.speak.v2.createConnection(args as any);
        // createConnection() builds the socket without dialing; the transport is
        // constructed on the first connect attempt.
        (socket as any).socket.reconnect();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        expect(urls).toHaveLength(1);
        return new URL(urls[0]!);
    }

    it("resolves the production host, path, and model", async () => {
        const url = await capturedUpgradeUrl({ model: "flux-alexis-en" });
        expect(url.protocol).toBe("wss:");
        expect(url.host).toBe("api.deepgram.com");
        expect(url.pathname).toBe("/v2/speak");
        expect(url.searchParams.get("model")).toBe("flux-alexis-en");
    });

    it("sends repeatable tags as repeated query parameters", async () => {
        // SpeakV2Tag is documented "Repeatable", so the wire form is
        // `tag=t1&tag=t2` — not one JSON-encoded array value.
        const url = await capturedUpgradeUrl({ model: "flux-alexis-en", tag: ["t1", "t2"] });
        expect(url.searchParams.getAll("tag")).toEqual(["t1", "t2"]);
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
        fake.emit("error", { message: "nope" });
        // waitForOpen rejects with the raw event, not an Error, so `.rejects.toThrow()`
        // would not match — compare the value. Converting the rejection to a resolution
        // before asserting would make this test pass even if waitForOpen resolved.
        await expect(promise).rejects.toEqual({ message: "nope" });
    });
});

// --------------------------------------------------------------------------- //
// resources/audio/client/Client.ts — generate() error branches
// --------------------------------------------------------------------------- //

describe("Speak V2 audio.generate error branches", () => {
    /**
     * The error branches are pure response-shape dispatch, so they are driven
     * through an injected fetcher rather than a real socket: no port to collide
     * with, no connect timeout to wait on, and the `reason` discriminant is set
     * explicitly instead of being inferred from whatever a closed port does on
     * the host running the suite.
     */
    function clientReturning(response: Record<string, unknown>) {
        return new DeepgramClient({
            apiKey: "test",
            maxRetries: 0,
            fetcher: (async () => response) as any,
        });
    }

    const rawResponse = {
        headers: new Headers(),
        redirected: false,
        status: 0,
        statusText: "",
        type: "basic",
        url: "",
    };

    it("throws BadRequestError on a 400 response", async () => {
        const client = clientReturning({
            ok: false,
            error: { reason: "status-code", statusCode: 400, body: { err_code: "Bad Request", err_msg: "boom" } },
            rawResponse: { ...rawResponse, status: 400 },
        });
        await expect(client.speak.v2.audio.generate({ model: "m", text: "t" })).rejects.toBeInstanceOf(BadRequestError);
    });

    it("throws DeepgramError on a non-400 status code", async () => {
        const client = clientReturning({
            ok: false,
            error: { reason: "status-code", statusCode: 500, body: { err_code: "Internal", err_msg: "kaboom" } },
            rawResponse: { ...rawResponse, status: 500 },
        });
        const error = await client.speak.v2.audio.generate({ model: "m", text: "t" }).catch((e) => e);
        expect(error).toBeInstanceOf(DeepgramError);
        expect(error).not.toBeInstanceOf(BadRequestError);
        expect((error as any).statusCode).toBe(500);
    });

    it("routes a transport failure through handleNonStatusCodeError", async () => {
        // `reason !== "status-code"` — the fetch failed before any status arrived.
        const client = clientReturning({
            ok: false,
            error: { reason: "unknown", errorMessage: "socket hang up" },
            rawResponse,
        });
        const error = await client.speak.v2.audio.generate({ model: "m", text: "t" }).catch((e) => e);
        expect(error).toBeInstanceOf(DeepgramError);
        expect((error as Error).message).toContain("socket hang up");
    });
});

// --------------------------------------------------------------------------- //
// resources/audio/client/Client.ts — query serialization over real HTTP
// --------------------------------------------------------------------------- //

describe("Speak V2 audio.generate query serialization", () => {
    let server: http.Server;
    let baseUrl: string;
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
        // Port 0 lets the OS pick a free port: a hard-coded one can already be in
        // use on a developer machine or a parallel CI job. `error` rejects the
        // setup so a bind failure surfaces as a failed hook, not a hook timeout.
        await new Promise<void>((resolve, reject) => {
            server.once("error", reject);
            server.listen(0, "127.0.0.1", resolve);
        });
        const address = server.address();
        if (address === null || typeof address === "string") {
            throw new Error("expected an AddressInfo from server.address()");
        }
        baseUrl = `http://127.0.0.1:${address.port}`;
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
            tag: ["t1", "t2"],
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
        // SpeakV2Tag is documented "Repeatable" — as observed on the wire, the two
        // tags arrive as two `tag` parameters, not one JSON-encoded array.
        expect(query.getAll("tag")).toEqual(["t1", "t2"]);
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
