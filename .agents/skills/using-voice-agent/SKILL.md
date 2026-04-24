---
name: using-voice-agent
description: Use when writing or reviewing JavaScript/TypeScript in this repo that builds an interactive voice agent via `agent.deepgram.com/v1/agent/converse`. Covers `client.agent.v1.createConnection()` / `connect()`, `sendSettings`, `sendMedia`, runtime updates, event handling, and function-call responses. Use `using-text-to-speech` for one-way synthesis, `using-speech-to-text` or `using-conversational-stt` for transcription only, and `using-management-api` for project/model admin rather than live agent runtime. Triggers include "voice agent", "agent converse", "full duplex", "barge-in", "function calling", and "agent.v1".
---

# Using Deepgram Voice Agent (JavaScript / TypeScript SDK)

Full-duplex voice agent runtime over `wss://agent.deepgram.com/v1/agent/converse`: audio in, LLM orchestration, audio out, plus function calling and prompt/runtime updates.

## When to use this product

- You want an **interactive voice assistant** where the user speaks, the agent thinks, and the agent responds with speech.
- You need **function / tool calling** inside the conversation loop.
- You want Deepgram to host the STT + think + TTS orchestration.

**Use a different skill when:**
- You only need transcription → `using-speech-to-text` or `using-conversational-stt`.
- You only need synthesis → `using-text-to-speech`.
- You want project keys, usage, models, or other admin APIs → `using-management-api`.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient, DeepgramEnvironment } = require("@deepgram/sdk");

const client = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  environment: DeepgramEnvironment.Agent,
});
```

The websocket itself is routed to the agent host by `src/CustomClient.ts`, but the repo example uses `DeepgramEnvironment.Agent` so `client.agent.v1.settings.think.models.list()` also points at the agent base.

## Quick start

From `examples/09-voice-agent.ts`:

```js
const deepgramConnection = await deepgramClient.agent.v1.createConnection();

deepgramConnection.on("message", (data) => {
  if (data.type === "ConversationText") {
    console.log("Conversation text:", data);
  } else if (typeof data === "string") {
    console.log("Audio received (length):", data.length);
  }
});

deepgramConnection.connect();
await deepgramConnection.waitForOpen();

deepgramConnection.sendSettings({
  type: "Settings",
  audio: {
    input: { encoding: "linear16", sample_rate: 24000 },
    output: { encoding: "linear16", sample_rate: 16000, container: "wav" },
  },
  agent: {
    language: "en",
    listen: { provider: { type: "deepgram", model: "nova-3" } },
    think: {
      provider: { type: "open_ai", model: "gpt-4o-mini" },
      prompt: "You are a friendly AI assistant.",
    },
    speak: { provider: { type: "deepgram", model: "aura-2-thalia-en" } },
    greeting: "Hello! How can I help you today?",
  },
});
```

The same example also shows `client.agent.v1.settings.think.models.list()` for discovering supported think models.

## Key parameters / API surface

- Connection setup: `client.agent.v1.createConnection()` / `connect()`.
- First outbound control message: `sendSettings(AgentV1Settings)`.
- Runtime updates: `sendUpdatePrompt(...)`, `sendUpdateThink(...)`, `sendUpdateSpeak(...)`, `sendInjectUserMessage(...)`, `sendInjectAgentMessage(...)`, `sendFunctionCallResponse(...)`, `sendKeepAlive(...)`, `sendMedia(...)`.
- Important inbound events from `src/api/resources/agent/resources/v1/client/Socket.ts`: `Welcome`, `SettingsApplied`, `ConversationText`, `UserStartedSpeaking`, `AgentThinking`, `FunctionCallRequest`, `AgentStartedSpeaking`, `AgentAudioDone`, `Warning`, `Error`, plus audio payloads.

## Limitations

This SDK exposes the **live agent runtime** plus `settings.think.models.list()`, but it does **not** expose persisted Voice Agent configuration CRUD endpoints in the current generated surface.

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Agent V1 Settings Think Models`; live websocket behavior is defined in `src/CustomClient.ts` and `src/api/resources/agent/resources/v1/client/{Client,Socket}.ts`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/voice-agent/voice-agent
   - https://developers.deepgram.com/docs/voice-agent
   - https://developers.deepgram.com/docs/configure-voice-agent
   - https://developers.deepgram.com/docs/voice-agent-message-flow

## Gotchas

1. **Settings must be first.** Send `sendSettings({ type: "Settings", ... })` immediately after the socket opens.
2. **Audio and JSON events share the same message stream.** Your `message` handler must branch on `typeof data` and `data.type`.
3. **Keepalive matters.** `examples/09-voice-agent.ts` sends `KeepAlive` every 5 seconds to preserve long sessions.
4. **Encoding/sample rates must line up on both sides.** Mismatches cause distorted uploads or unusable playback.
5. **Think-model discovery is separate from the websocket.** Use `client.agent.v1.settings.think.models.list()` before choosing providers.
6. **Function-call requests arrive as arrays.** Inspect `data.functions[]`, then answer with `sendFunctionCallResponse({ type: "FunctionCallResponse", id, name, content })`.
7. **Persisted agent configurations are not in this SDK today.** If you need stored configs, use raw HTTP or another SDK surface.

## Example files in this repo

- `examples/09-voice-agent.ts`
- `examples/34-agent-custom-providers.ts`
- `examples/35-agent-provider-combinations.ts`
- `examples/36-agent-inject-message.ts`

## Central product skills

For cross-language Deepgram product knowledge — the consolidated API reference, documentation finder, focused runnable recipes, third-party integration examples, and MCP setup — install the central skills:

```bash
npx skills add deepgram/skills
```

This SDK ships language-idiomatic code skills; `deepgram/skills` ships cross-language product knowledge (see `api`, `docs`, `recipes`, `examples`, `starters`, `setup-mcp`).
