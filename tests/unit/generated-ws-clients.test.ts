import { describe, expect, it } from "vitest";
import { V1Client as AgentV1Client } from "../../src/api/resources/agent/resources/v1/client/Client.js";
import { V1Client as ListenV1Client } from "../../src/api/resources/listen/resources/v1/client/Client.js";
import { V2Client as ListenV2Client } from "../../src/api/resources/listen/resources/v2/client/Client.js";
import { V1Client as SpeakV1Client } from "../../src/api/resources/speak/resources/v1/client/Client.js";

/**
 * The generated `connect()` methods on the WS clients build query strings from
 * their args, but the public SDK surface (CustomDeepgramClient) overrides them
 * with the custom websocket wrapper, so these code paths are never exercised by
 * the wire tests. We call the generated clients directly to cover both sides of
 * every optional-parameter / string-vs-serialized ternary.
 *
 * An already-aborted signal is passed so ReconnectingWebSocket short-circuits in
 * its constructor and never opens a real socket.
 */
function abortedSignal(): AbortSignal {
    const controller = new AbortController();
    controller.abort();
    return controller.signal;
}

function queryParamsOf(socket: unknown): Record<string, unknown> {
    return (socket as any).socket._queryParameters ?? {};
}

// Values chosen so string-valued params hit the `typeof x === "string"` branch
// and object/array-valued params hit the `toJson(...)` branch.
const listenV1StringArgs = {
    callback: "https://cb.example.com",
    callback_method: "POST",
    channels: "2",
    detect_entities: true,
    diarize: true,
    diarize_model: "v2",
    dictation: true,
    encoding: "linear16",
    endpointing: "300",
    extra: "note",
    interim_results: true,
    keyterm: "term",
    keywords: "kw",
    language: "en",
    mip_opt_out: "true",
    model: "nova-3",
    multichannel: true,
    numerals: true,
    profanity_filter: true,
    punctuate: true,
    redact: "pci",
    replace: "a:b",
    sample_rate: "16000",
    search: "hello",
    smart_format: true,
    tag: "t",
    utterance_end_ms: "1000",
    vad_events: true,
    version: "latest",
};

const listenV1ObjectArgs = {
    callback: { url: "x" },
    channels: 2,
    endpointing: 300,
    extra: { a: 1 },
    keyterm: ["term1", { w: 1 }],
    keywords: ["kw1"],
    language: ["en", "es"],
    mip_opt_out: true,
    replace: ["a:b"],
    sample_rate: 16000,
    search: ["hi"],
    tag: ["t1"],
    utterance_end_ms: 1000,
    version: { v: 1 },
    model: "nova-3",
};

const listenV2StringArgs = {
    model: "flux-general-en",
    encoding: "linear16",
    sample_rate: "16000",
    eager_eot_threshold: "0.5",
    eot_threshold: "0.7",
    eot_timeout_ms: "5000",
    keyterm: "kt",
    language_hint: "en",
    profanity_filter: true,
    mip_opt_out: "true",
    tag: "t",
};

const listenV2ObjectArgs = {
    model: "flux-general-en",
    sample_rate: 16000,
    eager_eot_threshold: 0.5,
    eot_threshold: 0.7,
    eot_timeout_ms: 5000,
    keyterm: ["kt1", { w: 2 }],
    language_hint: ["en", { l: 1 }],
    mip_opt_out: true,
    tag: ["t1"],
};

const speakV1StringArgs = {
    encoding: "linear16",
    mip_opt_out: "true",
    model: "aura-2-thalia-en",
    sample_rate: "24000",
    speed: 1,
};

const speakV1ObjectArgs = {
    mip_opt_out: true,
    model: "aura-2-thalia-en",
    sample_rate: 24000,
};

describe("generated Listen V1Client.connect query params", () => {
    const client = new ListenV1Client({ apiKey: "test" });

    it("serializes string-valued params", async () => {
        const socket = await client.connect({ ...listenV1StringArgs, abortSignal: abortedSignal() } as any);
        const qp = queryParamsOf(socket);
        expect(qp.model).toBe("nova-3");
        expect(qp.callback).toBe("https://cb.example.com");
    });

    it("serializes object/array-valued params", async () => {
        const socket = await client.connect({ ...listenV1ObjectArgs, abortSignal: abortedSignal() } as any);
        const qp = queryParamsOf(socket);
        expect(typeof qp.callback).toBe("string"); // toJson output
    });

    it("omits absent params", async () => {
        const socket = await client.connect({ model: "nova-3", abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).callback).toBeUndefined();
    });

    it("merges explicit queryParams overrides", async () => {
        const socket = await client.connect({
            model: "nova-3",
            queryParams: { custom: "1" },
            abortSignal: abortedSignal(),
        } as any);
        expect(queryParamsOf(socket).custom).toBe("1");
    });
});

describe("generated Listen V2Client.connect query params", () => {
    const client = new ListenV2Client({ apiKey: "test" });

    it("serializes string-valued params", async () => {
        const socket = await client.connect({ ...listenV2StringArgs, abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).model).toBe("flux-general-en");
    });

    it("serializes object/array-valued params (arrays mapped item-by-item)", async () => {
        const socket = await client.connect({ ...listenV2ObjectArgs, abortSignal: abortedSignal() } as any);
        const qp = queryParamsOf(socket);
        expect(Array.isArray(qp.keyterm)).toBe(true);
        expect(Array.isArray(qp.language_hint)).toBe(true);
    });

    it("omits absent params", async () => {
        const socket = await client.connect({ model: "flux-general-en", abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).encoding).toBeUndefined();
    });
});

describe("generated Speak V1Client.connect query params", () => {
    const client = new SpeakV1Client({ apiKey: "test" });

    it("serializes string-valued params", async () => {
        const socket = await client.connect({ ...speakV1StringArgs, abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).model).toBe("aura-2-thalia-en");
    });

    it("serializes object-valued params", async () => {
        const socket = await client.connect({ ...speakV1ObjectArgs, abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).model).toBe("aura-2-thalia-en");
    });

    it("omits absent params", async () => {
        const socket = await client.connect({ abortSignal: abortedSignal() } as any);
        expect(queryParamsOf(socket).encoding).toBeUndefined();
    });
});

describe("generated Agent V1Client.connect", () => {
    it("connects with an aborted signal and custom headers", async () => {
        const client = new AgentV1Client({ apiKey: "test" });
        const socket = await client.connect({
            Authorization: "Token abc",
            headers: { "x-custom": "1" },
            abortSignal: abortedSignal(),
        } as any);
        expect(socket).toBeDefined();
    });
});
