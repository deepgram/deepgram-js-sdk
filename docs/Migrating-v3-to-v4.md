# v3 to v4 Migration Guide

This guide helps you migrate from Deepgram JavaScript SDK v3 to v4.0.0. The v4 release updates the Voice Agent API from the preview spec to the official V1 spec. No other APIs were affected — if you are not using the Voice Agent API, no changes are required.

## Table of Contents

- [Installation](#installation)
- [Configuration Changes](#configuration-changes)
- [API Method Changes](#api-method-changes)
  - [Agent V1](#agent-v1)
- [Breaking Changes Summary](#breaking-changes-summary)

## Installation

```bash
npm install @deepgram/sdk
# or
pnpm add @deepgram/sdk
# or
yarn add @deepgram/sdk
```

## Configuration Changes

### v3 Agent Endpoint

```typescript
const agent = deepgram.agent("/agent");
```

### v4 Agent Endpoint

```typescript
const agent = deepgram.agent("/v1/agent/converse");

// Or use the default (v4 defaults to the V1 endpoint)
const agent = deepgram.agent();
```

## API Method Changes

### Agent V1

#### Settings Configuration

The settings message type changed from `SettingsConfiguration` to `Settings`, and the schema was restructured to use nested provider objects.

**v3**

```typescript
const agent = deepgram.agent();

agent.on(AgentEvents.Open, () => {
  agent.configure({
    audio: {
      input: {
        encoding: "linear16",
        sampleRate: 24000,
      },
      output: {
        encoding: "linear16",
        sampleRate: 16000,
        container: "wav",
      },
    },
    agent: {
      listen: {
        model: "nova-3",
        keyterms: ["deepgram"],
      },
      think: {
        provider: {
          type: "open_ai",
        },
        model: "gpt-4o-mini",
        instructions: "You are a helpful AI assistant.",
        functions: [
          {
            name: "get_weather",
            description: "Get the weather for a location.",
            url: "https://api.example.com/weather",
            headers: [{ key: "authorization", value: "Bearer ..." }],
            method: "POST",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string", description: "The city name." },
              },
            },
          },
        ],
      },
      speak: {
        model: "aura-2-thalia-en",
      },
    },
    context: {
      messages: [{ role: "assistant", content: "Hello!" }],
      replay: true,
    },
  });
});
```

**v4**

```typescript
const agent = deepgram.agent();

agent.on(AgentEvents.Open, () => {
  agent.configure({
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: 24000,
      },
      output: {
        encoding: "linear16",
        sample_rate: 16000,
        container: "wav",
      },
    },
    agent: {
      language: {
        type: "en",
      },
      listen: {
        provider: {
          type: "deepgram",
          model: "nova-3",
          keyterms: ["deepgram"],
        },
      },
      think: {
        provider: {
          type: "open_ai",
          model: "gpt-4o-mini",
        },
        prompt: "You are a helpful AI assistant.",
        functions: [
          {
            name: "get_weather",
            description: "Get the weather for a location.",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string", description: "The city name." },
              },
            },
            endpoint: {
              url: "https://api.example.com/weather",
              method: "POST",
              headers: { authorization: "Bearer ..." },
            },
          },
        ],
      },
      speak: {
        provider: {
          type: "deepgram",
          model: "aura-2-thalia-en",
        },
      },
    },
    greeting: "Hello!",
  });
});
```

#### Update Prompt (formerly Update Instructions)

**v3**

```typescript
agent.updateInstructions("You are now a pirate assistant.");
```

**v4**

```typescript
agent.updatePrompt("You are now a pirate assistant.");
```

#### Update Speak Model

**v3**

```typescript
agent.updateSpeak("aura-2-zeus-en");
```

**v4**

```typescript
agent.updateSpeak({
  provider: {
    type: "deepgram",
    model: "aura-2-zeus-en",
  },
});
```

#### Inject Agent Message

**v3**

```typescript
agent.injectAgentMessage("Hold on while I look that up for you.");
```

**v4**

```typescript
agent.injectAgentMessage("Hold on while I look that up for you.");
```

> **Note:** The method signature is the same, but the wire format changed from `{ message }` to `{ content }`. The SDK handles this internally.

#### Function Call Request Event

**v3**

```typescript
agent.on(AgentEvents.FunctionCallRequest, (data) => {
  // data.function_call_id: string
  // data.function_name: string
  // data.input: Record<string, any>
  console.log(`Function: ${data.function_name}`, data.input);
});
```

**v4**

```typescript
agent.on(AgentEvents.FunctionCallRequest, (data) => {
  // data.functions: Array<{ id: string, name: string, arguments: string, client_side: boolean }>
  for (const fn of data.functions) {
    console.log(`Function: ${fn.name}`, JSON.parse(fn.arguments));
  }
});
```

#### Function Call Response

**v3**

```typescript
agent.functionCallResponse({
  function_call_id: "abc-123",
  output: JSON.stringify({ temperature: 72 }),
});
```

**v4**

```typescript
agent.functionCallResponse({
  id: "abc-123",
  name: "get_weather",
  content: JSON.stringify({ temperature: 72 }),
});
```

#### Event Name Changes

**v3**

```typescript
agent.on(AgentEvents.InstructionsUpdated, () => {
  console.log("Instructions updated");
});

agent.on(AgentEvents.FunctionCalling, () => {
  console.log("Function is being called");
});
```

**v4**

```typescript
agent.on(AgentEvents.PromptUpdated, () => {
  console.log("Prompt updated");
});

// FunctionCalling event was removed in v4
```

#### Welcome Event

**v3**

```typescript
agent.on(AgentEvents.Welcome, (data) => {
  console.log(`Session: ${data.session_id}`);
});
```

**v4**

```typescript
agent.on(AgentEvents.Welcome, (data) => {
  console.log(`Request: ${data.request_id}`);
});
```

#### AgentStartedSpeaking Event

**v3**

```typescript
agent.on(AgentEvents.AgentStartedSpeaking, (data) => {
  console.log(`Latency: ${data.total_latency}ms`);
});
```

**v4**

```typescript
// This event now requires experimental mode to be enabled
agent.configure({
  experimental: true,
  // ... rest of config
});

agent.on(AgentEvents.AgentStartedSpeaking, (data) => {
  console.log(`Latency: ${data.total_latency}ms`);
});
```

#### Third-Party TTS Providers (New in v4)

**v4**

```typescript
// ElevenLabs
agent.configure({
  // ...
  agent: {
    speak: {
      provider: {
        type: "eleven_labs",
        model_id: "eleven_turbo_v2",
      },
    },
    // ...
  },
});

// Cartesia
agent.configure({
  // ...
  agent: {
    speak: {
      provider: {
        type: "cartesia",
        model_id: "sonic-english",
        voice: { mode: "id", id: "a0e99841-438c-4a64-b679-ae501e7d6091" },
        language: "en",
      },
    },
    // ...
  },
});
```

## Breaking Changes Summary

### Major Changes

1. **Agent Endpoint**: Default endpoint changed from `/agent` to `/v1/agent/converse`
2. **Settings Message**: Wire format changed from `SettingsConfiguration` to `Settings`
3. **Provider Nesting**: Listen, think, and speak models now use nested `provider` objects
4. **Audio Properties**: `sampleRate` (camelCase) changed to `sample_rate` (snake_case)
5. **Instructions → Prompt**: `updateInstructions()` renamed to `updatePrompt()`, `instructions` field renamed to `prompt`
6. **Function Calls**: Request format changed from single function to array of functions, response fields renamed
7. **Welcome Event**: `session_id` changed to `request_id`

### Removed Features

- `FunctionCalling` event (removed entirely)
- `InstructionsUpdated` event (replaced with `PromptUpdated`)
- `context.messages` and `context.replay` fields (removed from schema)
- Strict `AudioFormat` union type (replaced with loose encoding/sample_rate/container fields)
- Hardcoded think provider union types (replaced with generic provider objects)

### New Features in v4

- **Third-Party TTS Providers**: Support for ElevenLabs, Cartesia, and OpenAI TTS via `provider.type`
- **Language Configuration**: New `agent.language.type` field for specifying agent language
- **Greeting Message**: New `greeting` field for an initial agent message at connection start
- **Experimental Flag**: New `experimental` boolean to opt into experimental features like `AgentStartedSpeaking`
- **Custom LLM Endpoints**: New `endpoint` configuration for think and speak providers

### Migration Checklist

- [ ] Update to latest version: `npm install @deepgram/sdk`
- [ ] Update agent endpoint if explicitly set (default is now `/v1/agent/converse`)
- [ ] Restructure `agent.listen` to use `{ provider: { type: "deepgram", model, keyterms } }`
- [ ] Restructure `agent.think` to use `{ provider: { type, model }, prompt, functions }`
- [ ] Restructure `agent.speak` to use `{ provider: { type: "deepgram", model } }`
- [ ] Rename `instructions` to `prompt` in think configuration
- [ ] Rename `sampleRate` to `sample_rate` in audio input/output
- [ ] Replace `updateInstructions()` calls with `updatePrompt()`
- [ ] Update `updateSpeak()` calls to pass full provider config object
- [ ] Update `FunctionCallRequest` event handlers for new array format
- [ ] Update `FunctionCallResponse` to use `{ id, name, content }` instead of `{ function_call_id, output }`
- [ ] Replace `AgentEvents.InstructionsUpdated` with `AgentEvents.PromptUpdated`
- [ ] Remove any `AgentEvents.FunctionCalling` handlers
- [ ] Replace `context.messages` / `context.replay` with `greeting` if applicable
- [ ] Update `Welcome` event handlers to use `request_id` instead of `session_id`
- [ ] Add `experimental: true` if you need `AgentStartedSpeaking` events
- [ ] Test all Voice Agent connections and event handlers
