---
name: deepgram-js-conversational-stt
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram Conversational STT v2 / Flux (`/v2/listen`) for turn-aware streaming transcription. Covers `client.listen.v2.createConnection()` / `connect()`, Flux models, and turn events like `TurnInfo`. Use `deepgram-js-speech-to-text` for standard v1 ASR and `deepgram-js-voice-agent` for full-duplex assistants. Triggers include "flux", "v2 listen", "conversational STT", "turn detection", "end of turn", "EOT", and "listen.v2".
---

# Using Deepgram Conversational STT / Flux (JavaScript / TypeScript SDK)

Turn-aware streaming STT via `/v2/listen` for conversational audio and explicit turn events.

## When to use this product

- You need **turn-aware** transcription, not just a word stream.
- You want Flux-style events like `TurnInfo` and `Connected`.
- You are building a conversational interface but do **not** want the full Voice Agent runtime.

**Use a different skill when:**
- You want general v1 transcription or prerecorded REST → `deepgram-js-speech-to-text`.
- You want a hosted assistant with think + speak built in → `deepgram-js-voice-agent`.
- You want analytics overlays like sentiment and summaries → `deepgram-js-audio-intelligence`.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const client = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

## Quick start

From `examples/26-transcription-live-websocket-v2.ts`:

```js
const deepgramConnection = await deepgramClient.listen.v2.createConnection({
  model: "flux-general-en",
});

deepgramConnection.on("message", (data) => {
  if (data.type === "Connected") {
    console.log("Connected:", data);
  } else if (data.type === "TurnInfo") {
    console.log("Turn Info:", data);
  } else if (data.type === "FatalError") {
    deepgramConnection.close();
  }
});

deepgramConnection.connect();
await deepgramConnection.waitForOpen();

audioStream.on("data", (chunk) => {
  deepgramConnection.sendMedia(chunk);
});

audioStream.on("end", () => {
  deepgramConnection.sendCloseStream({ type: "CloseStream" });
});
```

## Key parameters / API surface

- Connect args from `src/api/resources/listen/resources/v2/client/Client.ts`: `model`, `encoding`, `sample_rate`, `eager_eot_threshold`, `eot_threshold`, `eot_timeout_ms`, `keyterm`, `tag`, `mip_opt_out`.
- Socket methods from `src/api/resources/listen/resources/v2/client/Socket.ts`: `sendMedia(...)`, `sendCloseStream(...)`, `sendListenV2Configure(...)`, `waitForOpen()`.
- Custom wrapper additions from `src/CustomClient.ts`: `createConnection(...)` alias and Node-only `ping(...)` helper.

## Limitations

- The current generated `ListenV2Model` type only exposes `"flux-general-en"`.
- Product docs mention broader Flux capabilities, but `flux-general-multi` / `language_hint` are **not** surfaced in this repo's generated types today.

## API reference (layered)

1. **In-repo reference**: `reference.md` does not currently document `listen.v2`; use `src/CustomClient.ts` and `src/api/resources/listen/resources/v2/client/{Client,Socket}.ts` as the in-repo source of truth.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/speech-to-text/listen-flux
   - https://developers.deepgram.com/docs/flux/quickstart
   - https://developers.deepgram.com/docs/flux/language-prompting

## Gotchas

1. **There is no REST path here.** This skill is `/v2/listen` WebSocket only.
2. **Current repo typing only allows `flux-general-en`.** Treat multilingual Flux support as a product capability not yet reflected in this SDK surface.
3. **Close with `sendCloseStream`, not `sendFinalize`.** Finalize is the v1 pattern.
4. **`ping()` is Node-only.** `src/CustomClient.ts` throws in browsers because browser WS ping frames are not user-exposed.
5. **`createConnection()` is lazy.** Call `connect()` after registering handlers.
6. **The example explicitly warns about access/availability.** A 400 may mean your account or endpoint is not enabled yet, not that your socket code is wrong.
7. **Omit `encoding` for containerized audio.** Keep it for raw PCM/Opus streams.

## Example files in this repo

- `examples/26-transcription-live-websocket-v2.ts`
- `examples/27-deepgram-session-header.ts`

## Central product skills

For cross-language Deepgram product knowledge — the consolidated API reference, documentation finder, focused runnable recipes, third-party integration examples, and MCP setup — install the central skills:

```bash
npx skills add deepgram/skills
```

This SDK ships language-idiomatic code skills; `deepgram/skills` ships cross-language product knowledge (see `api`, `docs`, `recipes`, `examples`, `starters`, `setup-mcp`).
