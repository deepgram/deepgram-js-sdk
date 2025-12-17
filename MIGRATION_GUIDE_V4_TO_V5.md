# Migration Guide: Deepgram JavaScript SDK v4 to v5

This guide will help you migrate your code from Deepgram JavaScript SDK v4 to v5. The v5 SDK introduces significant changes including a new auto-generated API structure, updated client initialization, and improved TypeScript support.

## Table of Contents

- [Overview](#overview)
- [Breaking Changes](#breaking-changes)
- [Client Initialization](#client-initialization)
- [API Structure Changes](#api-structure-changes)
- [Transcription](#transcription)
- [Live Transcription (WebSocket)](#live-transcription-websocket)
- [Voice Agent](#voice-agent)
- [Text-to-Speech](#text-to-speech)
- [Management API](#management-api)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Additional Notes](#additional-notes)

## Overview

The v5 SDK is built using [Fern](https://buildwithfern.com), which auto-generates the SDK from our API definition. This provides:

- **Better TypeScript support**: Full type safety across all API methods
- **Consistent API structure**: Versioned endpoints (v1, v2) with clear namespaces
- **Improved maintainability**: Auto-generated code stays in sync with API changes
- **Enhanced developer experience**: Better IntelliSense and documentation

## Breaking Changes

### 1. Client Initialization

**v4 (Old):**
```javascript
import { createClient } from "@deepgram/sdk";

// Method 1: API key as first parameter
const deepgram = createClient("YOUR_API_KEY");

// Method 2: Options object
const deepgram = createClient({ key: "YOUR_API_KEY" });

// Method 3: Environment variable
const deepgram = createClient();
```

**v5 (New):**
```javascript
import { DeepgramClient } from "@deepgram/sdk";

// Method 1: Options object with apiKey property
const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// Method 2: Environment variable (DEEPGRAM_API_KEY)
const deepgram = new DeepgramClient();
```

**Key Changes:**
- `createClient()` function → `new DeepgramClient()` constructor
- `key` property → `apiKey` property
- No longer supports passing API key as first parameter

### 2. API Structure

**v4 (Old):**
```javascript
// Direct method calls
deepgram.listen.transcribeUrl(...);
deepgram.manage.projects.list();
deepgram.speak.generate(...);
```

**v5 (New):**
```javascript
// Versioned namespaces
deepgram.listen.v1.media.transcribeUrl(...);
deepgram.manage.v1.projects.list();
deepgram.speak.v1.audio.generate(...);
```

**Key Changes:**
- All API methods are now under versioned namespaces (`v1`, `v2`)
- Additional resource namespaces (e.g., `media`, `audio`, `projects`)
- More explicit API structure

## Client Initialization

### Basic Initialization

**v4:**
```javascript
import { createClient } from "@deepgram/sdk";
const deepgram = createClient("YOUR_API_KEY");
```

**v5:**
```javascript
import { DeepgramClient } from "@deepgram/sdk";
const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });
```

### With Options

**v4:**
```javascript
const deepgram = createClient("YOUR_API_KEY", {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } }
});
```

**v5:**
```javascript
const deepgram = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.beta.deepgram.com"
});
```

### Access Token Authentication

**v4:**
```javascript
const deepgram = createClient({ accessToken: "YOUR_ACCESS_TOKEN" });
```

**v5:**
```javascript
const deepgram = new DeepgramClient({
  apiKey: "YOUR_ACCESS_TOKEN" // Access tokens work the same way
});
```

## API Structure Changes

### Namespace Organization

The v5 SDK organizes APIs into clear hierarchies:

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
├── manage
│   └── v1
│       ├── projects
│       ├── keys
│       ├── members
│       └── ...
├── agent
│   └── v1
│       └── (connect for Voice Agent)
└── auth
    └── v1
        └── tokens (grant)
```

## Transcription

### Prerecorded Transcription from URL

**v4:**
```javascript
const { result, error } = await deepgram.listen.transcribeUrl(
  "https://dpgr.am/spacewalk.wav",
  {
    model: "nova-3",
    language: "en",
    punctuate: true
  }
);
```

**v5:**
```javascript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
  language: "en",
  punctuate: true
});
```

**Key Changes:**
- URL is now part of the options object
- Method path: `listen.transcribeUrl()` → `listen.v1.media.transcribeUrl()`
- Returns data directly (no `result`/`error` wrapper)

### Prerecorded Transcription from File

**v4:**
```javascript
import { createReadStream } from "fs";

const { result, error } = await deepgram.listen.transcribeFile(
  createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en"
  }
);
```

**v5:**
```javascript
import { createReadStream } from "fs";

const data = await deepgram.listen.v1.media.transcribeFile(
  createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en"
  }
);
```

**Key Changes:**
- Method path: `listen.transcribeFile()` → `listen.v1.media.transcribeFile()`
- Returns data directly

### Async Transcription with Callback

**v4:**
```javascript
const { result, error } = await deepgram.listen.transcribeUrl(
  "https://dpgr.am/spacewalk.wav",
  {
    callback: "https://your-server.com/callback",
    callback_method: "POST",
    model: "nova-3"
  }
);
```

**v5:**
```javascript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  callback: "https://your-server.com/callback",
  callback_method: "POST",
  model: "nova-3"
});
```

## Live Transcription (WebSocket)

### V1 WebSocket API

**v4:**
```javascript
const connection = deepgram.listen.transcription.live({
  model: "nova-3",
  language: "en",
  punctuate: true,
  interim_results: true
});

connection.on("open", () => {
  console.log("Connected");
});

connection.on("transcript", (data) => {
  console.log(data);
});

connection.on("error", (error) => {
  console.error(error);
});

connection.start();
```

**v5:**
```javascript
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

**Key Changes:**
- Method: `listen.transcription.live()` → `listen.v1.connect()`
- `connect()` is now async and returns a promise
- Event: `transcript` → `message` (with type checking)
- Must call `connect()` and `waitForOpen()` explicitly
- String parameters for boolean-like options (`"true"` instead of `true`)

### V2 WebSocket API (New in v5)

**v5:**
```javascript
const connection = await deepgram.listen.v2.connect({
  model: "flux-general-en"
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
connection.socket.send(audioChunk);

// Close stream when done
connection.sendListenV2CloseStream({ type: "CloseStream" });
```

## Voice Agent

**v4:**
```javascript
const agent = deepgram.agent("/v1/agent/converse");

agent.on("open", () => {
  console.log("Agent connected");
});

agent.on("conversation", (data) => {
  console.log("Conversation:", data);
});

agent.start();
```

**v5:**
```javascript
const connection = await deepgram.agent.v1.connect();

connection.on("open", () => {
  console.log("Agent connected");
});

connection.on("message", (data) => {
  if (data.type === "ConversationText") {
    console.log("Conversation:", data);
  } else if (typeof data === "string") {
    // Audio data
    console.log("Audio received");
  }
});

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
      provider: {
        type: "deepgram",
        model: "nova-3"
      }
    },
    think: {
      provider: {
        type: "open_ai",
        model: "gpt-4o-mini"
      },
      prompt: "You are a friendly AI assistant."
    },
    speak: {
      provider: {
        type: "deepgram",
        model: "aura-2-thalia-en"
      }
    },
    greeting: "Hello! How can I help you today?"
  }
});
```

**Key Changes:**
- Method: `agent()` → `agent.v1.connect()`
- `connect()` is async
- Settings are sent via `sendAgentV1Settings()` method
- Message handling uses type checking

## Text-to-Speech

### Single Request

**v4:**
```javascript
const { result, error } = await deepgram.speak.generate({
  text: "Hello, world!",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav"
});
```

**v5:**
```javascript
const data = await deepgram.speak.v1.audio.generate({
  text: "Hello, world!",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav"
});
```

**Key Changes:**
- Method path: `speak.generate()` → `speak.v1.audio.generate()`
- Returns data directly

### Streaming TTS

**v4:**
```javascript
const connection = deepgram.speak.stream({
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav"
});

connection.on("audio", (audio) => {
  // Handle audio chunks
});

connection.start();
```

**v5:**
```javascript
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
    // Audio data as base64 string
    const audioBuffer = Buffer.from(data, "base64");
    // Handle audio
  }
});

connection.connect();
await connection.waitForOpen();

// Send text to synthesize
connection.sendSpeakV1Text({ type: "Text", text: "Hello, world!" });
```

## Management API

### Projects

**v4:**
```javascript
// List projects
const { result } = await deepgram.manage.projects.list();

// Get project
const { result } = await deepgram.manage.projects.get(projectId);

// Update project
const { result } = await deepgram.manage.projects.update(projectId, {
  name: "New Name"
});

// Delete project
await deepgram.manage.projects.delete(projectId);
```

**v5:**
```javascript
// List projects
const data = await deepgram.manage.v1.projects.list();

// Get project
const data = await deepgram.manage.v1.projects.get(projectId);

// Update project
const data = await deepgram.manage.v1.projects.update(projectId, {
  name: "New Name"
});

// Delete project
await deepgram.manage.v1.projects.delete(projectId);
```

**Key Changes:**
- Method path: `manage.projects.*` → `manage.v1.projects.*`
- Returns data directly

### API Keys

**v4:**
```javascript
// List keys
const { result } = await deepgram.manage.keys.list(projectId);

// Get key
const { result } = await deepgram.manage.keys.get(projectId, keyId);

// Create key
const { result } = await deepgram.manage.keys.create(projectId, {
  comment: "My API key",
  scopes: ["usage:write"]
});

// Delete key
await deepgram.manage.keys.delete(projectId, keyId);
```

**v5:**
```javascript
// List keys
const data = await deepgram.manage.v1.keys.list(projectId);

// Get key
const data = await deepgram.manage.v1.keys.get(projectId, keyId);

// Create key
const data = await deepgram.manage.v1.keys.create(projectId, {
  comment: "My API key",
  scopes: ["usage:write"]
});

// Delete key
await deepgram.manage.v1.keys.delete(projectId, keyId);
```

### Members, Invites, Usage, Billing

All management APIs follow the same pattern:

**v4:** `deepgram.manage.members.*`  
**v5:** `deepgram.manage.v1.members.*`

**v4:** `deepgram.manage.invites.*`  
**v5:** `deepgram.manage.v1.invites.*`

**v4:** `deepgram.manage.usage.*`  
**v5:** `deepgram.manage.v1.usage.*`

**v4:** `deepgram.manage.billing.*`  
**v5:** `deepgram.manage.v1.billing.*`

## Authentication

### Access Token Generation

**v4:**
```javascript
const { result } = await deepgram.auth.grantToken();
// Returns: { access_token: string, expires_in: 30 }
```

**v5:**
```javascript
const data = await deepgram.auth.v1.tokens.grant();
// Returns: { access_token: string, expires_in: 30 }
```

**Key Changes:**
- Method path: `auth.grantToken()` → `auth.v1.tokens.grant()`
- Returns data directly

## Error Handling

**v4:**
```javascript
const { result, error } = await deepgram.listen.transcribeUrl(...);

if (error) {
  console.error("Error:", error);
  return;
}

console.log("Result:", result);
```

**v5:**
```javascript
try {
  const data = await deepgram.listen.v1.media.transcribeUrl(...);
  console.log("Result:", data);
} catch (error) {
  console.error("Error:", error);
  // Error objects have: statusCode, body, rawResponse
}
```

**Key Changes:**
- No `result`/`error` wrapper - use try/catch
- Errors are thrown as exceptions
- Error objects include `statusCode`, `body`, and `rawResponse` properties

## Configuration

### Scoped Configuration

**v4:**
```javascript
const deepgram = createClient("YOUR_API_KEY", {
  global: {
    fetch: { options: { url: "https://api.beta.deepgram.com" } }
  },
  listen: {
    fetch: { options: { url: "http://localhost:8080" } }
  }
});
```

**v5:**
```javascript
const deepgram = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.beta.deepgram.com", // Global base URL
  // For namespace-specific URLs, use environment or baseUrl per request
});
```

**Key Changes:**
- Simplified configuration structure
- `baseUrl` replaces scoped URL configuration
- Environment-specific URLs can be set via `environment` option

### Environment Configuration

**v5:**
```javascript
import { DeepgramClient, DeepgramEnvironment } from "@deepgram/sdk";

const deepgram = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  environment: DeepgramEnvironment.Production // or .Staging, .Beta
});
```

## Additional Notes

### TypeScript Support

v5 provides full TypeScript support with auto-generated types:

```typescript
import { DeepgramClient } from "@deepgram/sdk";
import type { Deepgram } from "@deepgram/sdk";

const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// All types are available
const data: Deepgram.listen.v1.MediaTranscribeResponse = 
  await deepgram.listen.v1.media.transcribeUrl({...});
```

### Binary Data Handling

v5 improves binary data handling in WebSocket connections. Binary messages are automatically detected and passed through correctly.

### WebSocket Reconnection

v5 includes improved WebSocket reconnection logic with configurable retry attempts:

```javascript
const connection = await deepgram.listen.v1.connect({
  model: "nova-3",
  reconnectAttempts: 30 // Default is 30
});
```

### Response Types

All API methods return typed responses. Check the TypeScript definitions or `reference.md` for full response types.

## Migration Checklist

- [ ] Update client initialization from `createClient()` to `new DeepgramClient()`
- [ ] Change `key` property to `apiKey` in options
- [ ] Update all API method calls to include version namespace (`v1`, `v2`)
- [ ] Update transcription methods: `listen.*` → `listen.v1.media.*`
- [ ] Update WebSocket connections to use async `connect()` and `waitForOpen()`
- [ ] Update event handlers: `transcript` → `message` with type checking
- [ ] Update error handling from `{ result, error }` to try/catch
- [ ] Update management API calls: `manage.*` → `manage.v1.*`
- [ ] Update authentication: `auth.grantToken()` → `auth.v1.tokens.grant()`
- [ ] Update text-to-speech: `speak.*` → `speak.v1.audio.*`
- [ ] Test all WebSocket connections and event handlers
- [ ] Review and update configuration options

## Getting Help

If you encounter issues during migration:

1. Check the [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)
2. Review the examples in the `examples/` directory
3. Check `reference.md` for detailed API documentation
4. Open an issue on [GitHub](https://github.com/deepgram/deepgram-js-sdk/issues)

## Summary

The v5 SDK provides a more structured, type-safe API that better aligns with Deepgram's API architecture. While there are breaking changes, the migration is straightforward:

1. **Client**: `createClient()` → `new DeepgramClient()`
2. **Options**: `key` → `apiKey`
3. **Methods**: Add version namespaces (`v1`, `v2`)
4. **Errors**: Use try/catch instead of `{ result, error }`
5. **WebSockets**: Use async `connect()` and explicit event handling

The new structure provides better IntelliSense, type safety, and maintainability for your applications.

