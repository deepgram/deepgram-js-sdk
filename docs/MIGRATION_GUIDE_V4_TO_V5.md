# Migration Guide: Deepgram JavaScript SDK v4 to v5

This guide will help you migrate your code from Deepgram JavaScript SDK v4 to v5.

## Table of Contents

- [Notable Changes](#notable-changes)
- [Installation](#installation)
- [Client Initialization](#client-initialization)
- [Transcription Methods (Prerecorded)](#transcription-methods-prerecorded)
- [Transcription Methods (Live)](#transcription-methods-live)
- [Voice Agent](#voice-agent)
- [Text-to-Speech](#text-to-speech)
- [Management API](#management-api)
- [Text Intelligence API](#text-intelligence-api)
- [Models API](#models-api)
- [Authentication API](#authentication-api)
- [Self-Hosted APIs](#self-hosted-apis)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [API Structure Reference](#api-structure-reference)
- [Migration Checklist](#migration-checklist)
- [Getting Help](#getting-help)

## Notable Changes

- **Auto-generated SDK**: Built using [Fern](https://buildwithfern.com) for better type safety and API consistency
- **Versioned API namespaces**: All methods now include version prefixes (`v1`, `v2`)
- **New client initialization**: `createClient()` → `new DeepgramClient()`
- **Simplified error handling**: Use try/catch instead of `{ result, error }` destructuring
- **Improved WebSocket API**: Async `connect()` with explicit `waitForOpen()`
- **Access token support**: Native support for short-lived access tokens
- **Session ID tracking**: Automatic session ID generation for request tracking
- **V2 Live Transcription API**: New streaming transcription endpoint with improved features

## Installation

```bash
npm install @deepgram/sdk
# or
pnpm add @deepgram/sdk
# or
yarn add @deepgram/sdk
```

## Client Initialization

The client initialization has changed from a function to a class constructor.

**v4 (Before):**
```typescript
import { createClient } from "@deepgram/sdk";

// API key as first parameter
const deepgram = createClient("YOUR_API_KEY");

// Or with options object
const deepgram = createClient({ key: "YOUR_API_KEY" });

// Or using environment variable
const deepgram = createClient();
```

**v5 (After):**
```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Options object with apiKey property
const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// Or using environment variable (DEEPGRAM_API_KEY)
const deepgram = new DeepgramClient();
```

### Configuration Options

**v4 (Before):**
```typescript
const deepgram = createClient("YOUR_API_KEY", {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } }
});
```

**v5 (After):**
```typescript
const deepgram = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.beta.deepgram.com"
});
```

### Access Token Authentication

**v4 (Before):**
```typescript
const deepgram = createClient({ accessToken: "YOUR_ACCESS_TOKEN" });
```

**v5 (After):**
```typescript
const deepgram = new DeepgramClient({
  accessToken: "YOUR_ACCESS_TOKEN"
});
```

## Transcription Methods (Prerecorded)

### URL Transcription

**v4 (Before):**
```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    model: "nova-3",
    language: "en",
    punctuate: true
  }
);
```

**v5 (After):**
```typescript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
  language: "en",
  punctuate: true
});
```

### File Transcription

**v4 (Before):**
```typescript
import fs from "fs";

const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
  fs.createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en"
  }
);
```

**v5 (After):**
```typescript
import fs from "fs";

const data = await deepgram.listen.v1.media.transcribeFile(
  fs.createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en"
  }
);
```

### Callback Transcription

**v4 (Before):**
```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    callback: "https://your-server.com/callback",
    callback_method: "POST",
    model: "nova-3"
  }
);
```

**v5 (After):**
```typescript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  callback: "https://your-server.com/callback",
  callback_method: "POST",
  model: "nova-3"
});
```

## Transcription Methods (Live)

### V1 WebSocket API

**v4 (Before):**
```typescript
const connection = deepgram.listen.live({
  model: "nova-3",
  language: "en",
  punctuate: true,
  interim_results: true
});

connection.on(LiveTranscriptionEvents.Open, () => {
  console.log("Connected");
});

connection.on(LiveTranscriptionEvents.Transcript, (data) => {
  console.log(data);
});

connection.on(LiveTranscriptionEvents.Error, (error) => {
  console.error(error);
});
```

**v5 (After):**
```typescript
const connection = await deepgram.listen.v1.connect({
  model: "nova-3",
  language: "en",
  punctuate: "true",
  interim_results: "true"
});

connection.on("open", () => {
  console.log("Connected");
});

connection.on("message", (data) => {
  if (data.type === "Results") {
    console.log(data);
  }
});

connection.on("error", (error) => {
  console.error(error);
});

connection.connect();
await connection.waitForOpen();
```

> **Note:** In v5, WebSocket options that accept boolean values must be passed as strings (`"true"` instead of `true`).

> **Tip:** You can also use `createConnection()` as an alias for `connect()` if you find the naming clearer:
> ```typescript
> const connection = await deepgram.listen.v1.createConnection({ model: "nova-3" });
> ```

### V2 WebSocket API (New)

V5 introduces a new V2 live transcription API with improved features.

**v5 (After):**
```typescript
const connection = await deepgram.listen.v2.connect({
  model: "nova-3"
});

connection.on("open", () => {
  console.log("Connected");
});

connection.on("message", (data) => {
  if (data.type === "Connected") {
    console.log("Connected:", data);
  } else if (data.type === "TurnInfo") {
    console.log("Turn Info:", data);
  }
});

connection.connect();
await connection.waitForOpen();

// Send audio data
connection.sendMedia(audioChunk);

// Close stream when done
connection.sendCloseStream({ type: "CloseStream" });
```

### Multiple Keyterms

V2 supports multiple keyterms (boosted terms) passed as an array:

```typescript
const connection = await deepgram.listen.v2.connect({
  model: "nova-3",
  keyterm: ["deepgram", "transcription", "speech-to-text"]
});
```

## Voice Agent

**v4 (Before):**
```typescript
const agent = deepgram.agent("/v1/agent/converse");

agent.on("open", () => {
  console.log("Agent connected");
});

agent.on("conversation", (data) => {
  console.log("Conversation:", data);
});

agent.start();
```

**v5 (After):**
```typescript
const connection = await deepgram.agent.v1.connect();

connection.on("open", () => {
  console.log("Agent connected");
});

connection.on("message", (data) => {
  if (data.type === "ConversationText") {
    console.log("Conversation:", data);
  }
});

connection.connect();
await connection.waitForOpen();

// Or use the clearer alias
const connection = await deepgram.agent.v1.createConnection();
connection.connect();
await connection.waitForOpen();

// Configure agent settings
connection.sendAgentV1Settings({
  type: "Settings",
  audio: {
    input: {
      encoding: "linear16",
      sample_rate: 24000
    },
    output: {
      encoding: "linear16",
      sample_rate: 16000,
      container: "wav"
    }
  },
  agent: {
    language: "en",
    listen: {
      provider: { type: "deepgram", model: "nova-3" }
    },
    think: {
      provider: { type: "open_ai", model: "gpt-4o-mini" },
      prompt: "You are a friendly AI assistant."
    },
    speak: {
      provider: { type: "deepgram", model: "aura-2-thalia-en" }
    },
    greeting: "Hello! How can I help you today?"
  }
});
```

## Text-to-Speech

### Single Request

**v4 (Before):**
```typescript
const { result, error } = await deepgram.speak.request(
  { text: "Hello, world!" },
  {
    model: "aura-2-thalia-en",
    encoding: "linear16",
    container: "wav"
  }
);
```

**v5 (After):**
```typescript
const data = await deepgram.speak.v1.audio.generate({
  text: "Hello, world!",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav"
});
```

### Streaming TTS

**v4 (Before):**
```typescript
const connection = deepgram.speak.live({
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav"
});

connection.on("audio", (audio) => {
  // Handle audio chunks
});

connection.start();
```

**v5 (After):**
```typescript
const connection = await deepgram.speak.v1.connect({
  model: "aura-2-thalia-en",
  encoding: "linear16",
  sample_rate: 24000
});

connection.on("open", () => {
  console.log("Connected");
});

connection.on("message", (data) => {
  if (typeof data === "string") {
    const audioBuffer = Buffer.from(data, "base64");
    // Handle audio
  }
});

connection.connect();
await connection.waitForOpen();

// Or use the clearer alias
const connection = await deepgram.speak.v1.createConnection({ model: "aura-2-thalia-en" });
connection.connect();
await connection.waitForOpen();

// Send text to synthesize
connection.sendSpeakV1Text({ type: "Text", text: "Hello, world!" });
```

## Management API

All management API methods now include a `v1` namespace prefix.

### Projects

**v4 (Before):**
```typescript
// List projects
const { result, error } = await deepgram.manage.getProjects();

// Get project
const { result, error } = await deepgram.manage.getProject(projectId);

// Update project
const { result, error } = await deepgram.manage.updateProject(projectId, options);

// Delete project
const { error } = await deepgram.manage.deleteProject(projectId);
```

**v5 (After):**
```typescript
// List projects
const data = await deepgram.manage.v1.projects.list();

// Get project
const data = await deepgram.manage.v1.projects.get(projectId);

// Update project
const data = await deepgram.manage.v1.projects.update(projectId, options);

// Delete project
await deepgram.manage.v1.projects.delete(projectId);
```

### API Keys

**v4 (Before):**
```typescript
// List keys
const { result, error } = await deepgram.manage.getProjectKeys(projectId);

// Get key
const { result, error } = await deepgram.manage.getProjectKey(projectId, keyId);

// Create key
const { result, error } = await deepgram.manage.createProjectKey(projectId, options);

// Delete key
const { error } = await deepgram.manage.deleteProjectKey(projectId, keyId);
```

**v5 (After):**
```typescript
// List keys
const data = await deepgram.manage.v1.keys.list(projectId);

// Get key
const data = await deepgram.manage.v1.keys.get(projectId, keyId);

// Create key
const data = await deepgram.manage.v1.keys.create(projectId, options);

// Delete key
await deepgram.manage.v1.keys.delete(projectId, keyId);
```

### Members

**v4 (Before):**
```typescript
const { result, error } = await deepgram.manage.getProjectMembers(projectId);
const { error } = await deepgram.manage.removeProjectMember(projectId, memberId);
```

**v5 (After):**
```typescript
const data = await deepgram.manage.v1.members.list(projectId);
await deepgram.manage.v1.members.delete(projectId, memberId);
```

### Invites

**v4 (Before):**
```typescript
const { result, error } = await deepgram.manage.getProjectInvites(projectId);
const { result, error } = await deepgram.manage.sendProjectInvite(projectId, options);
const { error } = await deepgram.manage.deleteProjectInvite(projectId, email);
```

**v5 (After):**
```typescript
const data = await deepgram.manage.v1.invites.list(projectId);
const data = await deepgram.manage.v1.invites.create(projectId, options);
await deepgram.manage.v1.invites.delete(projectId, email);
```

### Usage

**v4 (Before):**
```typescript
const { result, error } = await deepgram.manage.getProjectUsageRequests(projectId, options);
const { result, error } = await deepgram.manage.getProjectUsageSummary(projectId, options);
const { result, error } = await deepgram.manage.getProjectUsageFields(projectId, options);
```

**v5 (After):**
```typescript
const data = await deepgram.manage.v1.usage.listRequests(projectId, options);
const data = await deepgram.manage.v1.usage.getSummary(projectId, options);
const data = await deepgram.manage.v1.usage.getFields(projectId, options);
```

### Billing

**v4 (Before):**
```typescript
const { result, error } = await deepgram.manage.getProjectBalances(projectId);
const { result, error } = await deepgram.manage.getProjectBalance(projectId, balanceId);
```

**v5 (After):**
```typescript
const data = await deepgram.manage.v1.billing.listBalances(projectId);
const data = await deepgram.manage.v1.billing.getBalance(projectId, balanceId);
```

## Text Intelligence API

The Text Intelligence API (`read`) analyzes text for topics, intents, sentiment, and more.

**v4 (Before):**
```typescript
// Analyze text
const { result, error } = await deepgram.read.analyzeText(
  { text: "Your text content here" },
  {
    language: "en",
    topics: true,
    intents: true,
    sentiment: true,
    summarize: true
  }
);

// Analyze URL
const { result, error } = await deepgram.read.analyzeUrl(
  { url: "https://example.com/article" },
  {
    language: "en",
    topics: true,
    sentiment: true
  }
);

// With callback
const { result, error } = await deepgram.read.analyzeTextCallback(
  { text: "Your text content here" },
  "https://your-server.com/callback",
  { topics: true }
);
```

**v5 (After):**
```typescript
// Analyze text
const data = await deepgram.read.v1.text.analyze({
  text: "Your text content here",
  language: "en",
  topics: true,
  intents: true,
  sentiment: true,
  summarize: true
});

// Analyze URL
const data = await deepgram.read.v1.text.analyze({
  url: "https://example.com/article",
  language: "en",
  topics: true,
  sentiment: true
});

// With callback
const data = await deepgram.read.v1.text.analyze({
  text: "Your text content here",
  callback: "https://your-server.com/callback",
  topics: true
});
```

> **Note:** In v5, both text and URL analysis use the same `analyze()` method. The SDK determines the analysis type based on whether you provide a `text` or `url` property.

## Models API

The Models API has moved from a top-level namespace to under `manage`.

**v4 (Before):**
```typescript
// List all models
const { result, error } = await deepgram.models.getAll();

// Get a specific model
const { result, error } = await deepgram.models.getModel(modelId);
```

**v5 (After):**
```typescript
// List all models
const data = await deepgram.manage.v1.models.list();

// List models for a project
const data = await deepgram.manage.v1.projects.models.list(projectId);

// Get a specific model for a project
const data = await deepgram.manage.v1.projects.models.get(projectId, modelId);
```

## Authentication API

### Access Token Generation

**v4 (Before):**
```typescript
const { result, error } = await deepgram.auth.grantToken();
```

**v5 (After):**
```typescript
const data = await deepgram.auth.v1.tokens.grant();
```

## Self-Hosted APIs

**v4 (Before):**
```typescript
const { result, error } = await deepgram.onprem.listCredentials(projectId);
const { result, error } = await deepgram.onprem.getCredentials(projectId, credentialId);
const { result, error } = await deepgram.onprem.createCredentials(projectId, options);
const { error } = await deepgram.onprem.deleteCredentials(projectId, credentialId);
```

**v5 (After):**
```typescript
const data = await deepgram.selfHosted.v1.distributionCredentials.list(projectId);
const data = await deepgram.selfHosted.v1.distributionCredentials.get(projectId, credentialId);
const data = await deepgram.selfHosted.v1.distributionCredentials.create(projectId, options);
await deepgram.selfHosted.v1.distributionCredentials.delete(projectId, credentialId);
```

## Error Handling

V5 uses standard try/catch error handling instead of the `{ result, error }` pattern.

**v4 (Before):**
```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  { model: "nova-3" }
);

if (error) {
  console.error("Error:", error);
  return;
}

console.log("Result:", result);
```

**v5 (After):**
```typescript
try {
  const data = await deepgram.listen.v1.media.transcribeUrl({
    url: "https://dpgr.am/spacewalk.wav",
    model: "nova-3"
  });
  console.log("Result:", data);
} catch (error) {
  console.error("Error:", error);
  // Error objects include: statusCode, body, rawResponse
}
```

## TypeScript Support

V5 provides enhanced TypeScript support with auto-generated types.

```typescript
import { DeepgramClient } from "@deepgram/sdk";
import type { Deepgram } from "@deepgram/sdk";

const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// All response types are available
const data: Deepgram.listen.v1.MediaTranscribeResponse =
  await deepgram.listen.v1.media.transcribeUrl({
    url: "https://dpgr.am/spacewalk.wav",
    model: "nova-3"
  });
```

## API Structure Reference

The v5 SDK organizes APIs into versioned namespaces:

```
DeepgramClient
├── listen
│   ├── v1
│   │   └── media (transcribeUrl, transcribeFile)
│   └── v2
│       └── (connect for WebSocket)
├── speak
│   └── v1
│       └── audio (generate)
│       └── (connect for streaming)
├── read
│   └── v1
│       └── text (analyze)
├── manage
│   └── v1
│       ├── projects
│       │   └── models (list, get)
│       ├── models (list)
│       ├── keys
│       ├── members
│       ├── invites
│       ├── usage
│       └── billing
├── agent
│   └── v1
│       └── (connect for Voice Agent)
├── auth
│   └── v1
│       └── tokens (grant)
└── selfHosted
    └── v1
        └── distributionCredentials
```

## Migration Checklist

Use this checklist to ensure you've updated all parts of your application:

- [ ] Update client initialization from `createClient()` to `new DeepgramClient()`
- [ ] Change `key` property to `apiKey` in options
- [ ] Update all API method calls to include version namespace (`v1`, `v2`)
- [ ] Update transcription methods: `listen.prerecorded.*` → `listen.v1.media.*`
- [ ] Update WebSocket connections to use async `connect()` (or `createConnection()`) and `waitForOpen()`
- [ ] Update event handlers from named events to `message` with type checking
- [ ] Update error handling from `{ result, error }` to try/catch
- [ ] Update management API calls: `manage.*` → `manage.v1.*`
- [ ] Update models API: `models.*` → `manage.v1.models.*` or `manage.v1.projects.models.*`
- [ ] Update text intelligence: `read.analyzeText()` / `read.analyzeUrl()` → `read.v1.text.analyze()`
- [ ] Update authentication: `auth.grantToken()` → `auth.v1.tokens.grant()`
- [ ] Update text-to-speech: `speak.*` → `speak.v1.audio.*`
- [ ] Update self-hosted: `onprem.*` → `selfHosted.v1.distributionCredentials.*`
- [ ] Test all WebSocket connections and event handlers
- [ ] Review and update configuration options

## Getting Help

If you encounter issues during migration:

1. Check the [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)
2. Review the examples in the [SDK repository](https://github.com/deepgram/deepgram-js-sdk/tree/main/examples)
3. Check the SDK's `reference.md` for detailed API documentation
4. Open an issue on [GitHub](https://github.com/deepgram/deepgram-js-sdk/issues)
