---
name: deepgram-js-text-intelligence
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram Text Intelligence / Read (`/v1/read`) for sentiment, summarization, topic detection, and intent recognition on text input. Covers `client.read.v1.text.analyze(...)` with `body: { text }` or `body: { url }`. Use `deepgram-js-audio-intelligence` when the source is audio instead of text. Triggers include "read API", "text intelligence", "analyze text", "sentiment", "summarize text", "topics", "intents", and "read.v1".
---

# Using Deepgram Text Intelligence (JavaScript / TypeScript SDK)

Analyze text or a hosted text URL for sentiment, summarization, topics, and intents via `/v1/read`.

## When to use this product

- You already have **text** (transcript, document, email, chat log) and want analytics.
- You want a single REST call; there is no streaming Read API in this SDK.

**Use a different skill when:**
- Your source is audio and you want the analytics applied during transcription → `deepgram-js-audio-intelligence`.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

## Quick start

From `examples/12-text-intelligence.ts`:

```js
const data = await deepgramClient.read.v1.text.analyze({
  body: {
    text: "Hello, world! This is a sample text for analysis.",
  },
  language: "en",
  summarize: "v2",
});

console.log("Analysis result:", JSON.stringify(data, null, 2));
```

For broader coverage, `examples/28-text-intelligence-advanced.ts` also demonstrates `sentiment`, `topics`, `intents`, custom topics/intents, callbacks, and URL input.

## Key parameters / API surface

| Param | Notes |
|---|---|
| `body` | Required. Use `{ text: "..." }` or `{ url: "https://..." }` |
| `language` | Usually required for analytics features |
| `sentiment` | Per-segment + aggregate sentiment |
| `summarize` | SDK examples use both `"v2"` and `true`; see gotchas |
| `topics`, `intents` | Model-detected topics and intents |
| `custom_topic`, `custom_intent` | `string` or `string[]` |
| `custom_topic_mode`, `custom_intent_mode` | Usually `"extended"` or `"strict"` |
| `callback`, `callback_method`, `tag` | Async delivery and labeling |

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Read V1 Text`; request typing also lives in `src/api/resources/read/resources/v1/resources/text/client/{Client,requests/TextAnalyzeRequest.ts}`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/text-intelligence/analyze-text
   - https://developers.deepgram.com/docs/text-intelligence
   - https://developers.deepgram.com/docs/text-sentiment-analysis

## Gotchas

1. **Prefer `body: { text | url }` in typed code.** That matches `TextAnalyzeRequest`; some examples also use top-level `text`, which is less reliable for strict TS.
2. **`summarize` is inconsistent across examples and generated comments.** The request type points at `TextAnalyzeRequestSummarize` (`"v2"` today), while generated comments mention boolean for Read and examples use both forms.
3. **This API is REST-only here.** No `read.v1` WebSocket exists in the repo.
4. **Custom topics/intents need a mode for predictable behavior.** Use `extended` or `strict`.
5. **The body is JSON, not raw text bytes.** Send `{ body: { text: ... } }`, not a string payload.
6. **Language support is product-side, not SDK-side.** If analytics look sparse, verify the feature/model/language combination in docs.

## Example files in this repo

- `examples/12-text-intelligence.ts`
- `examples/28-text-intelligence-advanced.ts`

## Central product skills

For cross-language Deepgram product knowledge — the consolidated API reference, documentation finder, focused runnable recipes, third-party integration examples, and MCP setup — install the central skills:

```bash
npx skills add deepgram/skills
```

This SDK ships language-idiomatic code skills; `deepgram/skills` ships cross-language product knowledge (see `api`, `docs`, `recipes`, `examples`, `starters`, `setup-mcp`).
