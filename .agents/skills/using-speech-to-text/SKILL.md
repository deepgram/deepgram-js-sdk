---
name: using-speech-to-text
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram Speech-to-Text v1 (`/v1/listen`) for prerecorded or live audio transcription. Covers `client.listen.v1.media.transcribeUrl` / `transcribeFile` (REST) plus `client.listen.v1.createConnection()` / `connect()` (WebSocket). Use `using-audio-intelligence` for summarize/sentiment/topics/diarize overlays, `using-conversational-stt` for Flux turn-taking on `/v2/listen`, and `using-voice-agent` for full-duplex assistants. Triggers include "transcribe", "speech to text", "STT", "listen.v1", "nova-3", "live transcription", and "websocket transcription".
---

# Using Deepgram Speech-to-Text (JavaScript / TypeScript SDK)

Basic transcription for prerecorded audio (REST) or live audio (WebSocket) via `/v1/listen`.

## When to use this product

- **REST (`client.listen.v1.media.transcribeUrl` / `transcribeFile`)** — one-shot transcription of a finished URL or file. Good for batch jobs, caption generation, offline processing.
- **WebSocket (`client.listen.v1.createConnection()` / `connect()`)** — continuous streaming transcription. Good for live captions, microphone audio, telephony streams, browser or Node realtime apps.

**Use a different skill when:**
- You also want summaries, topics, intents, sentiment, language detection, or redaction guidance on the same `/v1/listen` call → `using-audio-intelligence`.
- You need Flux turn-taking and end-of-turn events on `/v2/listen` → `using-conversational-stt`.
- You need a full interactive assistant with STT + LLM + TTS over one socket → `using-voice-agent`.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const client = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

Use the exported `DeepgramClient` from `src/CustomClient.ts`, not `DefaultDeepgramClient`. The wrapper adds the required `Token ` auth prefix, session headers, and patched WebSocket behavior.

## Quick start — REST (prerecorded URL)

From `examples/04-transcription-prerecorded-url.ts`:

```js
const data = await deepgramClient.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
  language: "en",
  punctuate: true,
  paragraphs: true,
  utterances: true,
});

console.log(
  "Transcription:",
  data.results?.channels?.[0]?.alternatives?.[0]?.transcript,
);
```

## Quick start — REST (prerecorded file)

From `examples/05-transcription-prerecorded-file.ts`:

```js
const { createReadStream } = require("fs");

const data = await deepgramClient.listen.v1.media.transcribeFile(
  createReadStream("./examples/spacewalk.wav"),
  {
    model: "nova-3",
    language: "en",
    punctuate: true,
    paragraphs: true,
    utterances: true,
    smart_format: true,
  }
);
```

`transcribeFile(...)` accepts multiple upload shapes in this SDK: `fs.ReadStream`, `Buffer`, `ReadableStream`, `Blob`, `File`, `ArrayBuffer`, and `Uint8Array` (see `examples/23-file-upload-types.ts`).

## Quick start — WebSocket (live streaming)

From `examples/07-transcription-live-websocket.ts`:

```js
const deepgramConnection = await deepgramClient.listen.v1.createConnection({
  model: "nova-3",
  language: "en",
  punctuate: "true",
  interim_results: "true",
});

deepgramConnection.on("message", (data) => {
  if (data.type === "Results") {
    console.log("Transcript:", data);
  }
});

deepgramConnection.connect();
await deepgramConnection.waitForOpen();

audioStream.on("data", (chunk) => {
  deepgramConnection.sendMedia(chunk);
});

audioStream.on("end", () => {
  deepgramConnection.sendFinalize({ type: "Finalize" });
});
```

The repo examples use the two-step socket flow: `createConnection()` → register handlers → `connect()` → `waitForOpen()`.

## Key parameters / API surface

- REST: `model`, `language`, `punctuate`, `smart_format`, `paragraphs`, `utterances`, `multichannel`, `numerals`, `search`, `keyterm`, `keywords`, `encoding`, `sample_rate`, `callback`, `tag`.
- WSS connect args (`src/api/resources/listen/resources/v1/client/Client.ts`): `model` is required; common realtime flags include `language`, `interim_results`, `endpointing`, `utterance_end_ms`, `vad_events`, `encoding`, `sample_rate`, `multichannel`, `punctuate`, `smart_format`.
- WSS client messages (`src/api/resources/listen/resources/v1/client/Socket.ts`): `sendMedia(...)`, `sendFinalize(...)`, `sendCloseStream(...)`, `sendKeepAlive(...)`.
- WSS server events: `Results`, `Metadata`, `UtteranceEnd`, `SpeechStarted`.

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Listen V1 Media` for REST; WSS behavior lives in `src/CustomClient.ts` and `src/api/resources/listen/resources/v1/client/{Client,Socket}.ts`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/speech-to-text/listen-pre-recorded
   - https://developers.deepgram.com/reference/speech-to-text/listen-streaming

## Gotchas

1. **Use `DeepgramClient`, not `DefaultDeepgramClient`.** The custom wrapper adds `Token` auth, session IDs, browser WS auth protocols, and patched sockets.
2. **Repo examples are two-stage for WSS.** `createConnection()` does not open the socket; call `connect()` and usually `waitForOpen()`.
3. **Finalize before closing v1 streams.** `sendFinalize({ type: "Finalize" })` flushes the final partial.
4. **Keep idle streams alive.** Use audio or `sendKeepAlive({ type: "KeepAlive" })` on long pauses.
5. **Raw audio metadata must match reality.** If you send PCM, `encoding` and `sample_rate` must match the bytes.
6. **Browser auth differs from Node auth.** In browsers, the wrapper moves auth/session info into WebSocket subprotocols because custom headers are unavailable.
7. **Use `/v2/listen` only for Flux.** If you need turn-aware conversational STT, switch skills instead of forcing v1.

## Example files in this repo

- `examples/04-transcription-prerecorded-url.ts`
- `examples/05-transcription-prerecorded-file.ts`
- `examples/06-transcription-prerecorded-callback.ts`
- `examples/07-transcription-live-websocket.ts`
- `examples/08-transcription-captions.ts`
- `examples/23-file-upload-types.ts`
- `examples/27-deepgram-session-header.ts`

## Central product skills

For cross-language Deepgram product knowledge — the consolidated API reference, documentation finder, focused runnable recipes, third-party integration examples, and MCP setup — install the central skills:

```bash
npx skills add deepgram/skills
```

This SDK ships language-idiomatic code skills; `deepgram/skills` ships cross-language product knowledge (see `api`, `docs`, `recipes`, `examples`, `starters`, `setup-mcp`).
