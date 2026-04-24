---
name: using-text-to-speech
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram Text-to-Speech v1 (`/v1/speak`) for audio synthesis. Covers one-shot REST via `client.speak.v1.audio.generate` and streaming WebSocket via `client.speak.v1.createConnection()` / `connect()`. Use `using-voice-agent` when you need full-duplex STT + LLM + TTS instead of one-way synthesis. Triggers include "TTS", "text to speech", "speak", "aura", "streaming TTS", and "speak.v1".
---

# Using Deepgram Text-to-Speech (JavaScript / TypeScript SDK)

Convert text to audio with one-shot REST generation or low-latency streaming synthesis via `/v1/speak`.

## When to use this product

- **REST (`client.speak.v1.audio.generate`)** — render finished text into an audio response. Best for downloadable files, pre-generated prompts, batch synthesis.
- **WebSocket (`client.speak.v1.createConnection()` / `connect()`)** — stream text in and receive audio out with lower latency. Best when an LLM is still producing tokens.

**Use a different skill when:**
- You need the agent to also listen, think, and handle barge-in → `using-voice-agent`.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const client = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

The repo examples use `require("../dist/cjs/index.js")`, but application code should normally import from `@deepgram/sdk`.

## Quick start — REST (one-shot)

From `examples/10-text-to-speech-single.ts`:

```js
const data = await deepgramClient.speak.v1.audio.generate({
  text: "Hello, this is a test of Deepgram's text-to-speech API.",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav",
});

console.log("Audio generated successfully", data);
```

`generate(...)` returns a `BinaryResponse`, not JSON. See `examples/25-binary-response.ts` for `.stream()`, `.arrayBuffer()`, `.blob()`, and `.bytes()` handling.

## Quick start — WebSocket (streaming)

From `examples/11-text-to-speech-streaming.ts`:

```js
const deepgramConnection = await deepgramClient.speak.v1.createConnection({
  model: "aura-2-thalia-en",
  encoding: "linear16",
});

deepgramConnection.on("message", (data) => {
  if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) {
    console.log("Audio received");
  } else if (data.type === "Flushed") {
    deepgramConnection.close();
  }
});

deepgramConnection.connect();
await deepgramConnection.waitForOpen();

deepgramConnection.sendText({ type: "Speak", text: "Hello from streaming TTS." });
deepgramConnection.sendFlush({ type: "Flush" });
```

## Key parameters / API surface

- REST & WSS: `model`, `encoding`, `sample_rate`, `container`, `bit_rate`, `callback`, `callback_method`, `tag`, `mip_opt_out`.
- REST response surface (`examples/25-binary-response.ts`): `response.stream()`, `response.arrayBuffer()`, `response.blob()`, `response.bytes()`, `response.bodyUsed`.
- WSS client messages (`src/api/resources/speak/resources/v1/client/Socket.ts`): `sendText(...)`, `sendFlush(...)`, `sendClear(...)`, `sendClose(...)`.
- WSS server events: binary audio payloads plus `Metadata`, `Flushed`, `Cleared`, `Warning`.

## Limitations

Unlike the Python SDK, this repo does **not** include a hand-written `TextBuilder` helper. If you want incremental token buffering before `sendText(...)`, build that helper in your application layer.

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Speak V1 Audio` for REST; WSS behavior lives in `src/CustomClient.ts` and `src/api/resources/speak/resources/v1/client/{Client,Socket}.ts`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/text-to-speech/speak-request
   - https://developers.deepgram.com/reference/text-to-speech/speak-streaming
   - https://developers.deepgram.com/docs/tts-models

## Gotchas

1. **REST returns binary, not JSON.** Treat the result like a streamed/binary body.
2. **Use the custom client wrapper.** `src/CustomClient.ts` patches binary WebSocket handling; the generated socket assumes JSON too aggressively.
3. **`createConnection()` is lazy.** Register handlers, then call `connect()` and `waitForOpen()`.
4. **Send `Flush` after your text.** Without `sendFlush({ type: "Flush" })`, trailing audio may not be emitted promptly.
5. **Streaming text is structured JSON.** Send `{ type: "Speak", text }`, not a raw string.
6. **Audio payload shape varies by runtime.** The same handler may receive `string`, `ArrayBuffer`, or `Blob`.
7. **Pick encoding/container/sample rate that match your sink.** Mismatches show up as static, silence, or unplayable files.

## Example files in this repo

- `examples/10-text-to-speech-single.ts`
- `examples/11-text-to-speech-streaming.ts`
- `examples/25-binary-response.ts`

## Central product skills

For cross-language Deepgram product knowledge — the consolidated API reference, documentation finder, focused runnable recipes, third-party integration examples, and MCP setup — install the central skills:

```bash
npx skills add deepgram/skills
```

This SDK ships language-idiomatic code skills; `deepgram/skills` ships cross-language product knowledge (see `api`, `docs`, `recipes`, `examples`, `starters`, `setup-mcp`).
