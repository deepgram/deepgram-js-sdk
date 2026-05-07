---
name: deepgram-js-audio-intelligence
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram audio analytics overlays on `/v1/listen` - summarize, topics, intents, sentiment, diarize, redact, detect_language, and entity detection. Same endpoint as plain STT, different params. Covers REST via `client.listen.v1.media.transcribeUrl` / `transcribeFile` and the WebSocket-supported subset on `client.listen.v1.createConnection()` / `connect()`. Use `deepgram-js-speech-to-text` for plain transcription and `deepgram-js-text-intelligence` for analytics on already-transcribed text. Triggers include "audio intelligence", "summarize audio", "diarize", "sentiment from audio", "redact PII", and "detect language audio".
---

# Using Deepgram Audio Intelligence (JavaScript / TypeScript SDK)

Analytics overlays applied to `/v1/listen`: summaries, topics, intents, sentiment, language detection, diarization, redaction, entities. Same client surface as STT; turn features on with parameters.

**Use a different skill when:** plain transcription → `deepgram-js-speech-to-text`; analytics on text → `deepgram-js-text-intelligence`; Flux turn-taking → `deepgram-js-conversational-stt`; full-duplex agent → `deepgram-js-voice-agent`.

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

// Verify intelligence results are present
const summary = data.results?.summary?.short;
const topics = data.results?.topics?.segments;
const sentiments = data.results?.sentiments?.segments;
if (!summary && !topics && !sentiments) {
  console.warn("No intelligence results — check feature/model/language support.");
}
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

## Workflow

1. **Select features** from the REST vs WSS table. WSS lacks `summarize`, `topics`, `intents`, `sentiment`, `detect_language`.
2. **Call** `transcribeUrl` / `transcribeFile` with chosen flags and `model: "nova-3"`.
3. **Validate response**: check `data.results?.summary`, `data.results?.topics?.segments`, `data.results?.sentiments?.segments`. Fields are absent (not errored) when the model/language combo does not support the feature.
4. **On missing results**: confirm the feature/model/language combination at https://developers.deepgram.com/docs/stt-intelligence-feature-overview, then retry with corrected params.

## Key parameters / API surface

- Analytics flags: `summarize`, `topics`, `intents`, `sentiment`, `detect_language`, `detect_entities`, `diarize`, `redact`, `custom_topic`, `custom_topic_mode`, `custom_intent`, `custom_intent_mode`.
- Standard STT flags still apply: `model`, `language`, `encoding`, `sample_rate`, `punctuate`, `smart_format`, `utterances`, `paragraphs`, `multichannel`.
- Nova-3-specific biasing in repo examples uses `keyterm`, not `keywords`.

## API reference (layered)

1. **In-repo**: `reference.md` → `Listen V1 Media`; WSS subset in `src/api/resources/listen/resources/v1/client/{Client,Socket}.ts`.
2. **OpenAPI / AsyncAPI**: https://developers.deepgram.com/openapi.yaml | https://developers.deepgram.com/asyncapi.yaml
3. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
4. **Product docs**: https://developers.deepgram.com/docs/stt-intelligence-feature-overview (links to summarization, topic detection, intent recognition, sentiment, language detection, redaction, diarization).

## Gotchas

1. **`summarize` is `"v2"`, not boolean.** The generated REST surface and examples use the string value.
2. **`redact` accepts arrays** like `["pci", "ssn"]` despite `ListenV1Redact` being a string alias.
3. **Use `keyterm`, not `keywords`, for Nova-3 biasing.**
4. **Prefer `nova-3`** when mixing many overlays -- broadest feature support.

## Example files in this repo

- `examples/22-transcription-advanced-options.ts`
- `examples/04-transcription-prerecorded-url.ts`
- `examples/05-transcription-prerecorded-file.ts`
- `examples/07-transcription-live-websocket.ts`

## Central product skills

For cross-language Deepgram product knowledge, install `npx skills add deepgram/skills`.
