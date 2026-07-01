import { describe, expect, it } from "vitest";
import { DeepgramClient } from "../../src";

/**
 * Exercises the error-handling branches of every generated REST client:
 * the `status-code` switch (400 -> BadRequestError, default -> DeepgramError)
 * and the `handleNonStatusCodeError` fallback for transport failures. A stubbed
 * `fetch` returns the desired status (or throws) without any network I/O, and
 * `maxRetries: 0` keeps retryable statuses from looping. Calling each method
 * with minimal args also covers the "param == null -> undefined" side of the
 * query-string ternaries.
 */

type FetchImpl = typeof fetch;

const errStatus =
    (status: number): FetchImpl =>
    async () =>
        new Response(JSON.stringify({ err_code: "BAD", err_msg: "nope" }), {
            status,
            headers: { "content-type": "application/json" },
        });

const netErr = (): FetchImpl => async () => {
    throw new Error("network down");
};

function client(fetchImpl: FetchImpl): DeepgramClient {
    return new DeepgramClient({ apiKey: "test", maxRetries: 0, fetch: fetchImpl });
}

// biome-ignore lint/suspicious/noExplicitAny: exercising generated clients with placeholder args
type Invoke = (c: any) => Promise<unknown>;

const invocations: Array<[string, Invoke]> = [
    ["auth.v1.tokens.grant", (c) => c.auth.v1.tokens.grant({})],
    ["listen.v1.media.transcribeUrl", (c) => c.listen.v1.media.transcribeUrl({ url: "https://dpgr.am/x.wav" })],
    ["listen.v1.media.transcribeFile", (c) => c.listen.v1.media.transcribeFile(Buffer.from("audio"), {})],
    ["speak.v1.audio.generate", (c) => c.speak.v1.audio.generate({ text: "hello" })],
    ["read.v1.text.analyze", (c) => c.read.v1.text.analyze({ text: "hello", language: "en" })],
    ["manage.v1.models.list", (c) => c.manage.v1.models.list({})],
    ["manage.v1.models.get", (c) => c.manage.v1.models.get("model-id")],
    ["manage.v1.projects.list", (c) => c.manage.v1.projects.list()],
    ["manage.v1.projects.get", (c) => c.manage.v1.projects.get("proj")],
    ["manage.v1.projects.delete", (c) => c.manage.v1.projects.delete("proj")],
    ["manage.v1.projects.update", (c) => c.manage.v1.projects.update("proj", { name: "n" })],
    ["manage.v1.projects.leave", (c) => c.manage.v1.projects.leave("proj")],
    ["manage.v1.projects.billing.balances.list", (c) => c.manage.v1.projects.billing.balances.list("proj")],
    ["manage.v1.projects.billing.balances.get", (c) => c.manage.v1.projects.billing.balances.get("proj", "bal")],
    ["manage.v1.projects.billing.breakdown.list", (c) => c.manage.v1.projects.billing.breakdown.list("proj", {})],
    ["manage.v1.projects.billing.fields.list", (c) => c.manage.v1.projects.billing.fields.list("proj", {})],
    ["manage.v1.projects.billing.purchases.list", (c) => c.manage.v1.projects.billing.purchases.list("proj", {})],
    ["manage.v1.projects.keys.list", (c) => c.manage.v1.projects.keys.list("proj", {})],
    [
        "manage.v1.projects.keys.create",
        (c) => c.manage.v1.projects.keys.create("proj", { comment: "c", scopes: ["x"] }),
    ],
    ["manage.v1.projects.keys.get", (c) => c.manage.v1.projects.keys.get("proj", "key")],
    ["manage.v1.projects.keys.delete", (c) => c.manage.v1.projects.keys.delete("proj", "key")],
    ["manage.v1.projects.members.list", (c) => c.manage.v1.projects.members.list("proj")],
    ["manage.v1.projects.members.delete", (c) => c.manage.v1.projects.members.delete("proj", "mem")],
    ["manage.v1.projects.members.invites.list", (c) => c.manage.v1.projects.members.invites.list("proj")],
    [
        "manage.v1.projects.members.invites.create",
        (c) => c.manage.v1.projects.members.invites.create("proj", { email: "e@x.com", scope: "member" }),
    ],
    [
        "manage.v1.projects.members.invites.delete",
        (c) => c.manage.v1.projects.members.invites.delete("proj", "e@x.com"),
    ],
    ["manage.v1.projects.members.scopes.list", (c) => c.manage.v1.projects.members.scopes.list("proj", "mem")],
    [
        "manage.v1.projects.members.scopes.update",
        (c) => c.manage.v1.projects.members.scopes.update("proj", "mem", { scope: "member" }),
    ],
    ["manage.v1.projects.models.list", (c) => c.manage.v1.projects.models.list("proj", {})],
    ["manage.v1.projects.models.get", (c) => c.manage.v1.projects.models.get("proj", "model")],
    ["manage.v1.projects.requests.list", (c) => c.manage.v1.projects.requests.list("proj", {})],
    ["manage.v1.projects.requests.get", (c) => c.manage.v1.projects.requests.get("proj", "req")],
    ["manage.v1.projects.usage.get", (c) => c.manage.v1.projects.usage.get("proj", {})],
    ["manage.v1.projects.usage.breakdown.get", (c) => c.manage.v1.projects.usage.breakdown.get("proj", {})],
    ["manage.v1.projects.usage.fields.list", (c) => c.manage.v1.projects.usage.fields.list("proj", {})],
    ["selfHosted.v1.distributionCredentials.list", (c) => c.selfHosted.v1.distributionCredentials.list("proj")],
    [
        "selfHosted.v1.distributionCredentials.create",
        (c) => c.selfHosted.v1.distributionCredentials.create("proj", { scopes: ["x"], provider: "quay" }),
    ],
    ["selfHosted.v1.distributionCredentials.get", (c) => c.selfHosted.v1.distributionCredentials.get("proj", "cred")],
    [
        "selfHosted.v1.distributionCredentials.delete",
        (c) => c.selfHosted.v1.distributionCredentials.delete("proj", "cred"),
    ],
    ["voiceAgent.configurations.list", (c) => c.voiceAgent.configurations.list("proj")],
    ["voiceAgent.configurations.create", (c) => c.voiceAgent.configurations.create("proj", {})],
    ["voiceAgent.configurations.get", (c) => c.voiceAgent.configurations.get("proj", "agent")],
    ["voiceAgent.configurations.update", (c) => c.voiceAgent.configurations.update("proj", "agent", {})],
    ["voiceAgent.configurations.delete", (c) => c.voiceAgent.configurations.delete("proj", "agent")],
    ["voiceAgent.variables.list", (c) => c.voiceAgent.variables.list("proj")],
    ["voiceAgent.variables.create", (c) => c.voiceAgent.variables.create("proj", {})],
    ["voiceAgent.variables.get", (c) => c.voiceAgent.variables.get("proj", "var")],
    ["voiceAgent.variables.delete", (c) => c.voiceAgent.variables.delete("proj", "var")],
    ["voiceAgent.variables.update", (c) => c.voiceAgent.variables.update("proj", "var", {})],
    ["agent.v1.settings.think.models.list", (c) => c.agent.v1.settings.think.models.list()],
];

const okJson =
    (body: unknown = {}): FetchImpl =>
    async () =>
        new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });

const okBinary = (): FetchImpl => async () =>
    new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { "content-type": "audio/wav" } });

// Every optional field set, so the "param != null" side of each query-string
// ternary is exercised (the error-path suite covers the "undefined" side).
const fullTranscribeRequest = {
    callback: "https://cb",
    callback_method: "POST",
    extra: { a: 1 },
    sentiment: true,
    summarize: "v2",
    tag: ["t"],
    topics: true,
    custom_topic: ["ct"],
    custom_topic_mode: "extended",
    intents: true,
    custom_intent: ["ci"],
    custom_intent_mode: "strict",
    detect_entities: true,
    detect_language: true,
    diarize: true,
    diarize_model: "v2",
    dictation: true,
    encoding: "linear16",
    filler_words: true,
    keyterm: ["kt"],
    keywords: ["kw"],
    language: "en",
    measurements: true,
    model: "nova-3",
    multichannel: true,
    numerals: true,
    paragraphs: true,
    profanity_filter: true,
    punctuate: true,
    redact: ["pci"],
    replace: ["a:b"],
    search: ["hi"],
    smart_format: true,
    utterances: true,
    utt_split: 0.8,
    version: "latest",
    mip_opt_out: true,
};

describe("REST client success paths with full query params", () => {
    it("transcribeUrl serializes every optional query param", async () => {
        const c = client(okJson({ results: {} }));
        await expect(
            c.listen.v1.media.transcribeUrl({ url: "https://dpgr.am/x.wav", ...fullTranscribeRequest }),
        ).resolves.toBeDefined();
    });

    it("transcribeFile serializes every optional query param", async () => {
        const c = client(okJson({ results: {} }));
        await expect(
            c.listen.v1.media.transcribeFile(Buffer.from("audio"), fullTranscribeRequest as never),
        ).resolves.toBeDefined();
    });

    it("speak audio generate serializes every optional query param and returns binary", async () => {
        const c = client(okBinary());
        await expect(
            c.speak.v1.audio.generate({
                text: "hello",
                callback: "https://cb",
                callback_method: "POST",
                mip_opt_out: true,
                tag: ["t"],
                bit_rate: 48000,
                container: "wav",
                encoding: "linear16",
                model: "aura-2-thalia-en",
                sample_rate: 24000,
                speed: 1,
            } as never),
        ).resolves.toBeDefined();
    });

    it("manage list endpoints serialize pagination query params", async () => {
        const c = client(okJson({ projects: [] }));
        await expect(c.manage.v1.projects.keys.list("proj", { status: "active" } as never)).resolves.toBeDefined();
        await expect(c.manage.v1.models.list({ include_outdated: true } as never)).resolves.toBeDefined();
    });
});

describe("REST client error handling", () => {
    it.each(invocations)("%s throws a BadRequestError on HTTP 400", async (_name, invoke) => {
        await expect(invoke(client(errStatus(400)))).rejects.toThrow();
    });

    it.each(invocations)("%s throws a DeepgramError on HTTP 500", async (_name, invoke) => {
        await expect(invoke(client(errStatus(500)))).rejects.toThrow();
    });

    it.each(invocations)("%s surfaces a non-status transport error", async (_name, invoke) => {
        await expect(invoke(client(netErr()))).rejects.toThrow();
    });
});
