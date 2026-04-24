---
name: using-audio-intelligence
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram audio analytics overlays on `/v1/listen` - summarize, topics, intents, sentiment, diarize, redact, detect_language, and entity detection. Same endpoint as plain STT, different params. Covers REST via `client.listen.v1.media.transcribeUrl` / `transcribeFile` and the WebSocket-supported subset on `client.listen.v1.createConnection()` / `connect()`. Use `using-speech-to-text` for plain transcription and `using-text-intelligence` for analytics on already-transcribed text. Triggers include "audio intelligence", "summarize audio", "diarize", "sentiment from audio", "redact PII", and "detect language audio".
---

# Using Deepgram Audio Intelligence (JavaScript / TypeScript SDK)

Analytics overlays applied to `/v1/listen`: summaries, topics, intents, sentiment, language detection, diarization, redaction, entities. Same client surface as STT; turn features on with parameters.

## When to use this product

- You have **audio** and want analytics returned alongside the transcript.
- REST is the primary path; the WebSocket path supports only a subset of intelligence features.

**Use a different skill when:**
- You just want transcript output → `using-speech-to-text`.
- You already have text and want analytics on that text → `using-text-intelligence`.
- You need Flux turn-taking → `using-conversational-stt`.
- You need a full interactive voice agent → `using-voice-agent`.

## Feature availability: REST vs WSS

| Feature | REST | WSS |
|---|---|---|
| `diarize` | yes | yes |
| `redact` | yes | yes |
| `detect_entities` | yes | yes |
| `punctuate`, `smart_format` | yes | yes |
| `summarize` | yes | no in current WSS connect args |
| `topics` | yes | no |
| `intents` | yes | no |
| `sentiment` | yes | no |
| `detect_language` | yes | no |

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const client = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

## Quick start — REST with analytics

From `examples/22-transcription-advanced-options.ts`:

```js
const data = await deepgramClient.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
  language: "en",
  punctuate: true,
  paragraphs: true,
  utterances: true,
  smart_format: true,
  sentiment: true,
  topics: true,
  custom_topic: "custom_topic",
  custom_topic_mode: "extended",
  intents: true,
  custom_intent: "custom_intent",
  custom_intent_mode: "extended",
  detect_entities: true,
  detect_language: true,
  diarize: true,
  keyterm: ["keyword1", "keyword2"],
  redact: ["pci", "ssn"],
});
```

## Quick start — WSS subset

Start from `examples/07-transcription-live-websocket.ts` and keep the same socket flow, but only use WSS-supported intelligence flags such as `diarize`, `redact`, and `detect_entities` in the connection args.

```js
const deepgramConnection = await deepgramClient.listen.v1.createConnection({
  model: "nova-3",
  diarize: true,
  redact: "pci",
  detect_entities: true,
});
```

## Key parameters / API surface

- Analytics flags: `summarize`, `topics`, `intents`, `sentiment`, `detect_language`, `detect_entities`, `diarize`, `redact`, `custom_topic`, `custom_topic_mode`, `custom_intent`, `custom_intent_mode`.
- Standard STT flags still apply: `model`, `language`, `encoding`, `sample_rate`, `punctuate`, `smart_format`, `utterances`, `paragraphs`, `multichannel`.
- Nova-3-specific biasing in repo examples uses `keyterm`, not `keywords`.

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Listen V1 Media`; WSS subset behavior lives in `src/CustomClient.ts` and `src/api/resources/listen/resources/v1/client/{Client,Socket}.ts`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/docs/stt-intelligence-feature-overview
   - https://developers.deepgram.com/docs/summarization
   - https://developers.deepgram.com/docs/topic-detection
   - https://developers.deepgram.com/docs/intent-recognition
   - https://developers.deepgram.com/docs/sentiment-analysis
   - https://developers.deepgram.com/docs/language-detection
   - https://developers.deepgram.com/docs/redaction
   - https://developers.deepgram.com/docs/diarization

## Gotchas

1. **`summarize` on `/v1/listen` is versioned, not plain boolean.** The generated REST surface and examples point at `"v2"`.
2. **Most intelligence flags are REST-only.** Current WSS connect args do not expose `topics`, `intents`, `sentiment`, `summarize`, or `detect_language`.
3. **`redact` typing is looser in practice than in the generated alias.** Examples pass arrays like `["pci", "ssn"]`, even though `ListenV1Redact` itself is just a string alias.
4. **Use `keyterm` for Nova-3 biasing.** `examples/22-transcription-advanced-options.ts` explicitly notes keywords are not supported for Nova-3.
5. **Model/feature support is product-side.** `nova-3` is the safest choice when mixing many overlays.
6. **Diarization quality depends on audio quality and duration.** Short or noisy clips churn speakers.

## Example files in this repo

- `examples/22-transcription-advanced-options.ts`
- `examples/04-transcription-prerecorded-url.ts`
- `examples/05-transcription-prerecorded-file.ts`
- `examples/07-transcription-live-websocket.ts`
