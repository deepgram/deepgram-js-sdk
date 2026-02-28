# v4 to v5 Migration Guide

This guide helps you migrate from Deepgram JavaScript SDK v4 to v5.0.0. The v5 release introduces significant improvements including auto-generated types via Fern, versioned API namespaces, simplified error handling, and an improved WebSocket API.

## Table of Contents

- [Installation](#installation)
- [Configuration Changes](#configuration-changes)
- [Authentication Changes](#authentication-changes)
- [API Method Changes](#api-method-changes)
  - [Auth V1](#auth-v1)
  - [Listen V1](#listen-v1)
  - [Speak V1](#speak-v1)
  - [Agent V1](#agent-v1)
  - [Read V1](#read-v1)
  - [Models V1](#models-v1)
  - [Manage V1](#manage-v1)
  - [Self-Hosted V1](#self-hosted-v1)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
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

### v4 Client Initialization

```typescript
import { createClient } from "@deepgram/sdk";

// API key as first parameter
const deepgram = createClient("YOUR_API_KEY");

// Or with options object
const deepgram = createClient({ key: "YOUR_API_KEY" });

// Or using environment variable
const deepgram = createClient();

// With custom base URL
const deepgram = createClient("YOUR_API_KEY", {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } },
});
```

### v5.0.0 Client Initialization

```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Options object with apiKey property
const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// Or using environment variable (DEEPGRAM_API_KEY)
const deepgram = new DeepgramClient();

// With custom base URL
const deepgram = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.beta.deepgram.com",
});
```

## Authentication Changes

### Access Token Authentication

- **v4**: `createClient({ accessToken: "YOUR_ACCESS_TOKEN" })`
- **v5.0.0**: `new DeepgramClient({ accessToken: "YOUR_ACCESS_TOKEN" })`

### Authentication Priority (v5.0.0)

1. Explicit `accessToken` parameter (highest priority)
2. Explicit `apiKey` parameter
3. `DEEPGRAM_API_KEY` environment variable (lowest priority)

## API Method Changes

### Auth V1

#### Grant Token

**v4**

```typescript
const { result, error } = await deepgram.auth.grantToken();
```

**v5.0.0**

```typescript
const data = await deepgram.auth.v1.tokens.grant();
```

### Listen V1

#### Transcribe URL

**v4**

```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    model: "nova-3",
    language: "en",
    punctuate: true,
  }
);
```

**v5.0.0**

```typescript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
  language: "en",
  punctuate: true,
});
```

#### Transcribe File

**v4**

```typescript
import fs from "fs";

const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
  fs.createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en",
  }
);
```

**v5.0.0**

```typescript
import fs from "fs";

const data = await deepgram.listen.v1.media.transcribeFile(
  fs.createReadStream("./audio.wav"),
  {
    model: "nova-3",
    language: "en",
  }
);
```

#### Transcribe URL with Callback

**v4**

```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    callback: "https://your-server.com/callback",
    callback_method: "POST",
    model: "nova-3",
  }
);
```

**v5.0.0**

```typescript
const data = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  callback: "https://your-server.com/callback",
  callback_method: "POST",
  model: "nova-3",
});
```

#### WebSocket Streaming (Listen V1)

**v4**

```typescript
import { LiveTranscriptionEvents } from "@deepgram/sdk";

const connection = deepgram.listen.live({
  model: "nova-3",
  language: "en",
  punctuate: true,
  interim_results: true,
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

**v5.0.0**

```typescript
const connection = await deepgram.listen.v1.connect({
  model: "nova-3",
  language: "en",
  punctuate: "true",
  interim_results: "true",
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

#### WebSocket Streaming (Listen V2 - New in v5.0.0)

**v5.0.0**

```typescript
const connection = await deepgram.listen.v2.connect({
  model: "flux-general-en",
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

### Speak V1

#### Generate Audio (REST)

**v4**

```typescript
const { result, error } = await deepgram.speak.request(
  { text: "Hello, world!" },
  {
    model: "aura-2-thalia-en",
    encoding: "linear16",
    container: "wav",
  }
);
```

**v5.0.0**

```typescript
const data = await deepgram.speak.v1.audio.generate({
  text: "Hello, world!",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav",
});
```

#### WebSocket Streaming (Speak V1)

**v4**

```typescript
const connection = deepgram.speak.live({
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav",
});

connection.on("audio", (audio) => {
  // Handle audio chunks
});

connection.start();
```

**v5.0.0**

```typescript
const connection = await deepgram.speak.v1.connect({
  model: "aura-2-thalia-en",
  encoding: "linear16",
  sample_rate: 24000,
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

// Send text to synthesize
connection.sendSpeakV1Text({ type: "Text", text: "Hello, world!" });
```

### Agent V1

#### Voice Agent Configuration

**v4**

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

**v5.0.0**

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

// Configure agent settings
connection.sendAgentV1Settings({
  type: "Settings",
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
    language: "en",
    listen: {
      provider: { type: "deepgram", model: "nova-3" },
    },
    think: {
      provider: { type: "open_ai", model: "gpt-4o-mini" },
      prompt: "You are a friendly AI assistant.",
    },
    speak: {
      provider: { type: "deepgram", model: "aura-2-thalia-en" },
    },
    greeting: "Hello! How can I help you today?",
  },
});
```

### Read V1

#### Text Analysis

**v4**

```typescript
// Analyze text
const { result, error } = await deepgram.read.analyzeText(
  { text: "Your text content here" },
  {
    language: "en",
    topics: true,
    intents: true,
    sentiment: true,
    summarize: true,
  }
);

// Analyze URL
const { result, error } = await deepgram.read.analyzeUrl(
  { url: "https://example.com/article" },
  {
    language: "en",
    topics: true,
    sentiment: true,
  }
);

// With callback
const { result, error } = await deepgram.read.analyzeTextCallback(
  { text: "Your text content here" },
  "https://your-server.com/callback",
  { topics: true }
);
```

**v5.0.0**

```typescript
// Analyze text
const data = await deepgram.read.v1.text.analyze({
  text: "Your text content here",
  language: "en",
  topics: true,
  intents: true,
  sentiment: true,
  summarize: true,
});

// Analyze URL
const data = await deepgram.read.v1.text.analyze({
  url: "https://example.com/article",
  language: "en",
  topics: true,
  sentiment: true,
});

// With callback
const data = await deepgram.read.v1.text.analyze({
  text: "Your text content here",
  callback: "https://your-server.com/callback",
  topics: true,
});
```

> **Note:** In v5, both text and URL analysis use the same `analyze()` method. The SDK determines the analysis type based on whether you provide a `text` or `url` property.

### Models V1

#### List Models

**v4**

```typescript
// List all models
const { result, error } = await deepgram.models.getAll();

// Get a specific model
const { result, error } = await deepgram.models.getModel(modelId);
```

**v5.0.0**

```typescript
// List all models
const data = await deepgram.manage.v1.models.list();

// List models for a project
const data = await deepgram.manage.v1.projects.models.list(projectId);

// Get a specific model for a project
const data = await deepgram.manage.v1.projects.models.get(projectId, modelId);
```

### Manage V1

#### Projects

**v4**

```typescript
// Get projects
const { result, error } = await deepgram.manage.getProjects();

// Get project
const { result, error } = await deepgram.manage.getProject(projectId);

// Update project
const { result, error } = await deepgram.manage.updateProject(
  projectId,
  options
);

// Delete project
const { error } = await deepgram.manage.deleteProject(projectId);
```

**v5.0.0**

```typescript
// Get projects
const data = await deepgram.manage.v1.projects.list();

// Get project
const data = await deepgram.manage.v1.projects.get(projectId);

// Update project
const data = await deepgram.manage.v1.projects.update(projectId, options);

// Delete project
await deepgram.manage.v1.projects.delete(projectId);
```

#### Keys

**v4**

```typescript
// List keys
const { result, error } = await deepgram.manage.getProjectKeys(projectId);

// Get key
const { result, error } = await deepgram.manage.getProjectKey(
  projectId,
  keyId
);

// Create key
const { result, error } = await deepgram.manage.createProjectKey(
  projectId,
  options
);

// Delete key
const { error } = await deepgram.manage.deleteProjectKey(projectId, keyId);
```

**v5.0.0**

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

#### Members

**v4**

```typescript
// Get members
const { result, error } = await deepgram.manage.getProjectMembers(projectId);

// Remove member
const { error } = await deepgram.manage.removeProjectMember(
  projectId,
  memberId
);
```

**v5.0.0**

```typescript
// Get members
const data = await deepgram.manage.v1.members.list(projectId);

// Remove member
await deepgram.manage.v1.members.delete(projectId, memberId);
```

#### Scopes

**v4**

```typescript
// Get member scopes
const { result, error } = await deepgram.manage.getProjectMemberScopes(
  projectId,
  memberId
);

// Update scope
const { result, error } = await deepgram.manage.updateProjectMemberScope(
  projectId,
  memberId,
  options
);
```

**v5.0.0**

```typescript
// Get member scopes
const data = await deepgram.manage.v1.scopes.list(projectId, memberId);

// Update scope
const data = await deepgram.manage.v1.scopes.update(
  projectId,
  memberId,
  options
);
```

#### Invitations

**v4**

```typescript
// List invites
const { result, error } = await deepgram.manage.getProjectInvites(projectId);

// Send invite
const { result, error } = await deepgram.manage.sendProjectInvite(
  projectId,
  options
);

// Delete invite
const { error } = await deepgram.manage.deleteProjectInvite(projectId, email);
```

**v5.0.0**

```typescript
// List invites
const data = await deepgram.manage.v1.invites.list(projectId);

// Send invite
const data = await deepgram.manage.v1.invites.create(projectId, options);

// Delete invite
await deepgram.manage.v1.invites.delete(projectId, email);
```

#### Usage

**v4**

```typescript
// Get all requests
const { result, error } = await deepgram.manage.getProjectUsageRequests(
  projectId,
  options
);

// Get usage summary
const { result, error } = await deepgram.manage.getProjectUsageSummary(
  projectId,
  options
);

// Get usage fields
const { result, error } = await deepgram.manage.getProjectUsageFields(
  projectId,
  options
);
```

**v5.0.0**

```typescript
// Get all requests
const data = await deepgram.manage.v1.usage.listRequests(projectId, options);

// Get usage summary
const data = await deepgram.manage.v1.usage.getSummary(projectId, options);

// Get usage fields
const data = await deepgram.manage.v1.usage.getFields(projectId, options);
```

#### Billing

**v4**

```typescript
// Get all balances
const { result, error } = await deepgram.manage.getProjectBalances(projectId);

// Get balance
const { result, error } = await deepgram.manage.getProjectBalance(
  projectId,
  balanceId
);
```

**v5.0.0**

```typescript
// Get all balances
const data = await deepgram.manage.v1.billing.listBalances(projectId);

// Get balance
const data = await deepgram.manage.v1.billing.getBalance(projectId, balanceId);
```

### Self-Hosted V1

#### Distribution Credentials

**v4**

```typescript
// List credentials
const { result, error } = await deepgram.onprem.listCredentials(projectId);

// Get credentials
const { result, error } = await deepgram.onprem.getCredentials(
  projectId,
  credentialId
);

// Create credentials
const { result, error } = await deepgram.onprem.createCredentials(
  projectId,
  options
);

// Delete credentials
const { error } = await deepgram.onprem.deleteCredentials(
  projectId,
  credentialId
);
```

**v5.0.0**

```typescript
// List credentials
const data = await deepgram.selfHosted.v1.distributionCredentials.list(
  projectId
);

// Get credentials
const data = await deepgram.selfHosted.v1.distributionCredentials.get(
  projectId,
  credentialId
);

// Create credentials
const data = await deepgram.selfHosted.v1.distributionCredentials.create(
  projectId,
  options
);

// Delete credentials
await deepgram.selfHosted.v1.distributionCredentials.delete(
  projectId,
  credentialId
);
```

## Error Handling

### v4 Error Pattern

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

### v5.0.0 Error Pattern

```typescript
try {
  const data = await deepgram.listen.v1.media.transcribeUrl({
    url: "https://dpgr.am/spacewalk.wav",
    model: "nova-3",
  });
  console.log("Result:", data);
} catch (error) {
  console.error("Error:", error);
  // Error objects include: statusCode, body, rawResponse
}
```

## TypeScript Support

V5 provides enhanced TypeScript support with auto-generated types. All request and response types can be imported in two ways:

### Direct Type Imports

```typescript
import { DeepgramClient } from "@deepgram/sdk";
import type {
  ListenV1Response,
  SpeakV1Response,
  ReadV1Response,
  GetProjectV1Response,
} from "@deepgram/sdk";

const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

const data: ListenV1Response = await deepgram.listen.v1.media.transcribeUrl({
  url: "https://dpgr.am/spacewalk.wav",
  model: "nova-3",
});
```

### Namespace Type Imports

```typescript
import { DeepgramClient } from "@deepgram/sdk";
import type { Deepgram } from "@deepgram/sdk";

const deepgram = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

const data: Deepgram.ListenV1Response =
  await deepgram.listen.v1.media.transcribeUrl({
    url: "https://dpgr.am/spacewalk.wav",
    model: "nova-3",
  });
```

## Breaking Changes Summary

### Major Changes

1. **Client Initialization**: `createClient()` replaced with `new DeepgramClient()`
2. **API Structure**: All methods now use versioned namespaces (`v1`, `v2`)
3. **Error Handling**: `{ result, error }` pattern replaced with standard try/catch
4. **WebSocket API**: Complete redesign with async `connect()` and `waitForOpen()`
5. **Type Safety**: Enhanced auto-generated types via Fern
6. **Configuration**: Simplified options object with `apiKey` and `baseUrl`

### Removed Features

- `createClient()` function (replaced with `new DeepgramClient()`)
- `key` property in options (replaced with `apiKey`)
- `{ result, error }` return pattern (replaced with try/catch)
- `LiveTranscriptionEvents` enum for WebSocket events (replaced with string events)
- Separate `analyzeText()` / `analyzeUrl()` / `analyzeTextCallback()` methods (unified into `analyze()`)
- Top-level `models` namespace (moved to `manage.v1.models`)
- `onprem` namespace (renamed to `selfHosted`)

### New Features in v5.0.0

- **Auto-generated SDK**: Built using Fern for better type safety and API consistency
- **Listen V2**: New streaming transcription endpoint with improved features
- **Access Token Support**: Native support for short-lived access tokens
- **Session ID Tracking**: Automatic session ID generation for request tracking
- **Enhanced TypeScript**: Auto-generated types with direct and namespace imports
- **Unified Analysis**: Single `analyze()` method for text and URL analysis

### Migration Checklist

- [ ] Update to latest version: `npm install @deepgram/sdk`
- [ ] Replace `createClient()` with `new DeepgramClient()`
- [ ] Change `key` property to `apiKey` in options
- [ ] Update all API method calls to include version namespace (`v1`, `v2`)
- [ ] Update transcription methods: `listen.prerecorded.*` → `listen.v1.media.*`
- [ ] Update WebSocket connections to use async `connect()` and `waitForOpen()`
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
