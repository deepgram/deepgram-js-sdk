# Deepgram JavaScript SDK

[![Static Badge](https://img.shields.io/badge/%24__-Discord-blue?logo=discord&logoColor=white&link=https%3A%2F%2Fdiscord.gg%2Fdeepgram)](https://discord.gg/deepgram) [![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

> 🎯 **Development Setup**: This project uses [Corepack](https://nodejs.org/api/corepack.html) for package manager consistency. Run `corepack enable` once, then use `pnpm` commands normally. See [DEVELOPMENT.md](./DEVELOPMENT.md) for details.

<!-- TOC -->

- [Documentation](#documentation)
- [Migrating from earlier versions](#migrating-from-earlier-versions)
  - [V2 to V3](#v2-to-v3)
  - [V3.\* to V3.4](#v3-to-v34)
  - [V3.\* to V4](#v3-to-v4)
- [Installation](#installation)
  - [UMD](#umd)
  - [ESM](#esm)
- [Authentication](#authentication)
  - [1. API Key Authentication (Recommended)](#1-api-key-authentication-recommended)
  - [2. Access Token Authentication](#2-access-token-authentication)
  - [3. Proxy Authentication](#3-proxy-authentication)
  - [Getting Credentials](#getting-credentials)
    - [API Keys](#api-keys)
    - [Access Tokens](#access-tokens)
  - [Environment Variables](#environment-variables)
  - [Getting an API Key](#getting-an-api-key)
- [Scoped Configuration](#scoped-configuration)
  - [Global Defaults](#global-defaults)
  - [Namespace-specific Configurations](#namespace-specific-configurations)
  - [Transport Options](#transport-options)
  - [Examples](#examples)
    - [Change the API url used for all SDK methods](#change-the-api-url-used-for-all-sdk-methods)
    - [Change the API url used for the Voice Agent websocket](#change-the-api-url-used-for-the-voice-agent-websocket)
    - [Change the API url used for transcription only](#change-the-api-url-used-for-transcription-only)
    - [Override fetch transmitter](#override-fetch-transmitter)
    - [Proxy requests in the browser](#proxy-requests-in-the-browser)
    - [Set custom headers for fetch](#set-custom-headers-for-fetch)
- [Browser Usage](#browser-usage)
- [Transcription](#transcription)
  - [Remote Files](#remote-files)
  - [Local Files](#local-files)
  - [Callbacks / Async](#callbacks--async)
  - [Live Transcription (WebSocket)](#live-transcription-websocket)
  - [Captions](#captions)
- [Voice Agent](#voice-agent)
- [Text to Speech](#text-to-speech)
  - [Single-Request](#single-request)
  - [Continuous Text Stream (WebSocket)](#continuous-text-stream-websocket)
- [Text Intelligence](#text-intelligence)
- [Token Management](#token-management)
  - [Get Token Details](#get-token-details)
  - [Grant Access Token](#grant-access-token)
- [Projects](#projects)
  - [Get Projects](#get-projects)
  - [Get Project](#get-project)
  - [Update Project](#update-project)
  - [Delete Project](#delete-project)
- [Keys](#keys)
  - [List Keys](#list-keys)
  - [Get Key](#get-key)
  - [Create Key](#create-key)
  - [Delete Key](#delete-key)
- [Members](#members)
  - [Get Members](#get-members)
  - [Remove Member](#remove-member)
- [Scopes](#scopes)
  - [Get Member Scopes](#get-member-scopes)
  - [Update Scope](#update-scope)
- [Invitations](#invitations)
  - [List Invites](#list-invites)
  - [Send Invite](#send-invite)
  - [Delete Invite](#delete-invite)
  - [Leave Project](#leave-project)
- [Usage](#usage)
  - [Get All Requests](#get-all-requests)
  - [Get Request](#get-request)
  - [Summarize Usage](#summarize-usage)
  - [Get Fields](#get-fields)
  - [Summarize Usage (Deprecated)](#summarize-usage-1)
- [Billing](#billing)
  - [Get All Balances](#get-all-balances)
  - [Get Balance](#get-balance)
- [Models](#models)
  - [Get All Models](#get-all-models)
  - [Get All Project Models](#get-all-project-models)
  - [Get Model](#get-model)
- [On-Prem APIs](#on-prem-apis)
  - [List On-Prem credentials](#list-on-prem-credentials)
  - [Get On-Prem credentials](#get-on-prem-credentials)
  - [Create On-Prem credentials](#create-on-prem-credentials)
  - [Delete On-Prem credentials](#delete-on-prem-credentials)
- [Backwards Compatibility](#backwards-compatibility)
- [Development and Contributing](#development-and-contributing)
  - [Debugging and making changes locally](#debugging-and-making-changes-locally)
- [Getting Help](#getting-help)
<!-- /TOC -->

## Documentation

You can learn more about the Deepgram API at [developers.deepgram.com](https://developers.deepgram.com/docs).

## Migrating from earlier versions

### V2 to V3

We have published [a migration guide on our docs](https://developers.deepgram.com/docs/js-sdk-v2-to-v3-migration-guide), showing how to move from v2 to v3.

### V3.\* to V3.4

We recommend using only documented interfaces, as we strictly follow semantic versioning (semver) and breaking changes may occur for undocumented interfaces. To ensure compatibility, consider pinning your versions if you need to use undocumented interfaces.

### V3.\* to V4

The Voice Agent interfaces have been updated to use the new Voice Agent V1 API. Please refer to our [Documentation](https://developers.deepgram.com/docs/voice-agent-v1-migration) on Migration to new V1 Agent API.

## Installation

You can install this SDK directly from [[npm](https://www.npmjs.com/package/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk).

```bash
npm install @deepgram/sdk
```

or

```bash
pnpm install @deepgram/sdk
```

or

```bash
yarn add @deepgram/sdk
```

### UMD

You can now use plain `<script>`s to import deepgram from CDNs, like:

```html
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
```

or even:

```html
<script src="https://unpkg.com/@deepgram/sdk"></script>
```

Then you can use it from a global deepgram variable:

```html
<script>
  const { createClient } = deepgram;
  const deepgramClient = createClient("deepgram-api-key");

  console.log("Deepgram client instance: ", deepgramClient);
  // ...
</script>
```

### ESM

You can now use type="module" `<script>`s to import deepgram from CDNs, like:

```html
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
  const deepgramClient = createClient("deepgram-api-key");

  console.log("Deepgram client instance: ", deepgramClient);
  // ...
</script>
```

## Authentication

The Deepgram SDK supports three authentication methods:

### 1. API Key Authentication (Recommended)

Uses `Token` scheme in Authorization header.

```js
import { createClient } from "@deepgram/sdk";

// Method 1: Pass API key as first parameter
const deepgramClient = createClient("YOUR_DEEPGRAM_API_KEY");

// Method 2: Pass API key in options object
const deepgramClient = createClient({ key: "YOUR_DEEPGRAM_API_KEY" });

// Method 3: Use environment variable (DEEPGRAM_API_KEY)
const deepgramClient = createClient();
```

### 2. Access Token Authentication

Uses `Bearer` scheme in Authorization header. Access tokens are temporary (30-second TTL) and must be obtained using an API key.

```js
import { createClient } from "@deepgram/sdk";

// Must use accessToken property in options object
const deepgramClient = createClient({ accessToken: "YOUR_ACCESS_TOKEN" });

// Or use environment variable (DEEPGRAM_ACCESS_TOKEN)
const deepgramClient = createClient();
```

### 3. Proxy Authentication

For browser environments or custom proxy setups. Pass `"proxy"` as the API key.

```js
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient("proxy", {
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});
```

> **Important**: Your proxy must set the `Authorization: token DEEPGRAM_API_KEY` header and forward requests to Deepgram's API.

### Getting Credentials

#### API Keys

Create API keys via the Management API:

```js
const { result, error } = await deepgramClient.manage.createProjectKey(projectId, {
  comment: "My API key",
  scopes: ["usage:write"],
});
```

**Endpoint**: `POST https://api.deepgram.com/v1/projects/:projectId/keys`

#### Access Tokens

Generate temporary access tokens (requires existing API key):

```js
const { result, error } = await deepgramClient.auth.grantToken();
// Returns: { access_token: string, expires_in: 30 }
```

**Endpoint**: `POST https://api.deepgram.com/v1/auth/grant`

### Environment Variables

The SDK automatically checks for credentials in this priority order:

1. `DEEPGRAM_ACCESS_TOKEN` (highest priority)
2. `DEEPGRAM_API_KEY` (fallback)

### Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

## Scoped Configuration

The SDK supports scoped configuration. You'll be able to configure various aspects of each namespace of the SDK from the initialization. Below outlines a flexible and customizable configuration system for the Deepgram SDK. Here's how the namespace configuration works:

### Global Defaults

- The `global` namespace serves as the foundational configuration applicable across all other namespaces unless overridden.
- Includes general settings like URL and headers applicable for all API calls.
- If no specific configurations are provided for other namespaces, the `global` defaults are used.

### Namespace-specific Configurations

- Each namespace (`listen`, `manage`, `onprem`, `read`, `speak`) can have its specific configurations which override the `global` settings within their respective scopes.
- Allows for detailed control over different parts of the application interacting with various Deepgram API endpoints.

### Transport Options

- Configurations for both `fetch` and `websocket` can be specified under each namespace, allowing different transport mechanisms for different operations.
- For example, the `fetch` configuration can have its own URL and proxy settings distinct from the `websocket`.
- The generic interfaces define a structure for transport options which include a client (like a `fetch` or `WebSocket` instance) and associated options (like headers, URL, proxy settings).

This configuration system enables robust customization where defaults provide a foundation, but every aspect of the client's interaction with the API can be finely controlled and tailored to specific needs through namespace-specific settings. This enhances the maintainability and scalability of the application by localizing configurations to their relevant contexts.

### Examples

#### Change the API url used for all SDK methods

Useful for using different API environments (for e.g. beta).

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } },
});
```

#### Change the API url used for the Voice Agent websocket

Useful for using a voice agent proxy (for e.g. 3rd party provider auth).

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { websocket: { options: { url: "ws://localhost:8080" } } },
});
```

#### Change the API url used for transcription only

Useful for on-prem installations. Only affects requests to `/listen` endpoints.

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  listen: { fetch: { options: { url: "http://localhost:8080" } } },
});
```

#### Override fetch transmitter

Useful for providing a custom http client.

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const yourFetch = async () => {
  return Response("...etc");
};

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { fetch: { client: yourFetch } },
});
```

#### Proxy requests in the browser

This SDK now works in the browser. If you'd like to make REST-based requests (pre-recorded transcription, on-premise, and management requests), then you'll need to use a proxy as we do not support custom CORS origins on our API. To set up your proxy, you configure the SDK like so:

```js
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient("proxy", {
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});
```

> Important: You must pass `"proxy"` as your API key, and use the proxy to set the `Authorization` header to your Deepgram API key.

Your proxy service should replace the Authorization header with `Authorization: token <DEEPGRAM_API_KEY>` and return results verbatim to the SDK.

Check out our example Node-based proxy here: [Deepgram Node Proxy](https://github.com/deepgram-devs/deepgram-node-proxy).

#### Set custom headers for fetch

Useful for many things.

```js
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient({
  global: { fetch: { options: { headers: { "x-custom-header": "foo" } } } },
});
```

## Browser Usage

The SDK works in modern browsers with some considerations:

### WebSocket Features (Full Support)

- **Live Transcription**: ✅ Direct connection to `wss://api.deepgram.com`
- **Voice Agent**: ✅ Direct connection to `wss://agent.deepgram.com`
- **Live Text-to-Speech**: ✅ Direct connection to `wss://api.deepgram.com`

### REST API Features (Proxy Required)

- **Pre-recorded Transcription**: ⚠️ Requires proxy due to CORS
- **Text Intelligence**: ⚠️ Requires proxy due to CORS
- **Management APIs**: ⚠️ Requires proxy due to CORS

### Setup Options

#### Option 1: CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
<script>
  const { createClient } = deepgram;
  const deepgramClient = createClient("YOUR_API_KEY");
</script>
```

#### Option 2: CDN (ESM)

```html
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
  const deepgramClient = createClient("YOUR_API_KEY");
</script>
```

#### Option 3: Proxy for REST APIs

See [proxy requests in the browser](#proxy-requests-in-the-browser) for REST API access.

## Transcription

### Remote Files

Transcribe audio from a URL.

```js
const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/listen`

[See our API reference for more info](https://developers.deepgram.com/reference/speech-to-text-api/listen).

### Local Files

Transcribe audio from a file.

```js
const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
  fs.createReadStream("./examples/spacewalk.wav"),
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/listen`

[See our API reference for more info](https://developers.deepgram.com/reference/speech-to-text-api/listen).

### Callbacks / Async

We have a `Callback` version of both `transcribeFile` and `transcribeUrl`, which simply takes a `CallbackUrl` class.

```js
import { CallbackUrl } from "@deepgram/sdk";

const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrlCallback(
  { url: "https://dpgr.am/spacewalk.wav" },
  new CallbackUrl("http://callback/endpoint"),
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/listen?callback=http://callback/endpoint`

[See our API reference for more info](https://developers.deepgram.com/reference/speech-to-text-api/listen).

### Live Transcription (WebSocket)

Connect to our websocket and transcribe live streaming audio.

```js
const deepgramConnection = deepgramClient.listen.live({
  model: "nova-3",
  // live transcription options
});

deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
  deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log(data);
  });

  source.addListener("got-some-audio", async (event) => {
    deepgramConnection.send(event.raw_audio_data);
  });
});
```

**WebSocket Endpoint**: `wss://api.deepgram.com/v1/listen`

[See our API reference for more info](https://developers.deepgram.com/reference/speech-to-text-api/listen-streaming).

### Captions

Convert deepgram transcriptions to captions.

```js
import { webvtt, srt } from "@deepgram/sdk";

const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl({
  model: "nova-3",
  // pre-recorded transcription options
});

const vttResult = webvtt(result);
const srtResult = srt(result);
```

[See our standalone captions library for more information](https://github.com/deepgram/deepgram-node-captions).

## Voice Agent

Configure a Voice Agent.

```js
import { AgentEvents } from "@deepgram/sdk";

// Create an agent connection
const deepgramConnection = deepgramClient.agent();

// Set up event handlers
deepgramConnection.on(AgentEvents.Open, () => {
  console.log("Connection opened");

  // Set up event handlers
  deepgramConnection.on(AgentEvents.ConversationText, (data) => {
    console.log(data);
  });

  // other events

  // Configure the agent once connection is established
  deepgramConnection.configure({
    // agent configuration
  });

  // etc...
});
```

**WebSocket Endpoint**: `wss://agent.deepgram.com/v1/agent/converse`

[See our API reference for more info](https://developers.deepgram.com/reference/voice-agent-api/agent).

## Text to Speech

### Single-Request

Convert text into speech using the REST API.

```js
const { result } = await deepgramClient.speak.request(
  { text },
  {
    model: "aura-2-thalia-en",
    // text to speech options
  }
);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/speak`

[See our API reference for more info](https://developers.deepgram.com/reference/text-to-speech-api/speak).

### Continuous Text Stream (WebSocket)

Connect to our websocket and send a continuous text stream to generate speech.

```js
const deepgramConnection = deepgramClient.speak.live({
  model: "aura-2-thalia-en",
  // live text to speech options
});

deepgramConnection.on(LiveTTSEvents.Open, () => {
  console.log("Connection opened");

  // Send text data for TTS synthesis
  deepgramConnection.sendText(text);

  // Send Flush message to the server after sending the text
  deepgramConnection.flush();

  deepgramConnection.on(LiveTTSEvents.Close, () => {
    console.log("Connection closed");
  });
});
```

**WebSocket Endpoint**: `wss://api.deepgram.com/v1/speak`

[See our API reference for more info](https://developers.deepgram.com/reference/text-to-speech-api/speak-streaming).

## Text Intelligence

Analyze text using our intelligence AI features.

```js
const text = `The history of the phrase 'The quick brown fox jumps over the
lazy dog'. The earliest known appearance of the phrase was in The Boston
Journal...`;

const { result, error } = await deepgramClient.read.analyzeText(
  { text },
  {
    language: "en",
    // text intelligence options
  }
);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/read`

[See our API reference for more info](https://developers.deepgram.com/reference/text-intelligence-api/text-read).

## Token Management

### Get Token Details

Retrieves the details of the current authentication token.

```js
const { result, error } = await deepgramClient.manage.getTokenDetails();
```

**API Endpoint**: `GET https://api.deepgram.com/v1/auth/token`

[See our API reference for more info](https://developers.deepgram.com/reference/authentication)

### Grant Access Token

Creates a temporary access token with a 30-second TTL. Requires an existing API key for authentication.

```js
// Create a temporary access token
const { result, error } = await deepgramClient.auth.grantToken();
// Returns: { access_token: string, expires_in: 30 }

// Use the access token in a new client instance
const tempClient = createClient({ accessToken: result.access_token });
```

**API Endpoint**: `POST https://api.deepgram.com/v1/auth/grant`

> **Important**: You _must_ pass an `accessToken` property to use a temporary token. Passing the token as a raw string will treat it as an API key and use the incorrect authorization scheme.

[See our API reference for more info](https://developers.deepgram.com/reference/token-based-auth-api/grant-token).

## Projects

### Get Projects

Returns all projects accessible by the API key.

```js
const { result, error } = await deepgramClient.manage.getProjects();
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects`

[See our API reference for more info](https://developers.deepgram.com/reference/get-projects).

### Get Project

Retrieves a specific project based on the provided project_id.

```js
const { result, error } = await deepgramClient.manage.getProject(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId`

[See our API reference for more info](https://developers.deepgram.com/reference/get-project).

### Update Project

Update a project.

```js
const { result, error } = await deepgramClient.manage.updateProject(projectId, options);
```

**API Endpoint**: `PATCH https://api.deepgram.com/v1/projects/:projectId`

[See our API reference for more info](https://developers.deepgram.com/reference/update-project).

### Delete Project

Delete a project.

```js
const { error } = await deepgramClient.manage.deleteProject(projectId);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId`

[See our API reference for more info](https://developers.deepgram.com/reference/delete-project).

## Keys

### List Keys

Retrieves all keys associated with the provided project_id.

```js
const { result, error } = await deepgramClient.manage.getProjectKeys(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/keys`

[See our API reference for more info](https://developers.deepgram.com/reference/list-keys).

### Get Key

Retrieves a specific key associated with the provided project_id.

```js
const { result, error } = await deepgramClient.manage.getProjectKey(projectId, projectKeyId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/keys/:keyId`

[See our API reference for more info](https://developers.deepgram.com/reference/get-key).

### Create Key

Creates an API key with the provided scopes.

```js
const { result, error } = await deepgramClient.manage.createProjectKey(projectId, {
  comment: "My API key",
  scopes: ["usage:write"], // Required: array of scope strings
  tags: ["production"], // Optional: array of tag strings
  time_to_live_in_seconds: 86400, // Optional: TTL in seconds
  // OR use expiration_date: "2024-12-31T23:59:59Z" // Optional: ISO date string
});
```

**API Endpoint**: `POST https://api.deepgram.com/v1/projects/:projectId/keys`

[See our API reference for more info](https://developers.deepgram.com/reference/create-key).

### Delete Key

Deletes a specific key associated with the provided project_id.

```js
const { error } = await deepgramClient.manage.deleteProjectKey(projectId, projectKeyId);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId/keys/:keyId`

[See our API reference for more info](https://developers.deepgram.com/reference/delete-key).

## Members

### Get Members

Retrieves account objects for all of the accounts in the specified project_id.

```js
const { result, error } = await deepgramClient.manage.getProjectMembers(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/members`

[See our API reference for more info](https://developers.deepgram.com/reference/get-members).

### Remove Member

Removes member account for specified member_id.

```js
const { error } = await deepgramClient.manage.removeProjectMember(projectId, projectMemberId);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId/members/:memberId`

[See our API reference for more info](https://developers.deepgram.com/reference/remove-member).

## Scopes

### Get Member Scopes

Retrieves scopes of the specified member in the specified project.

```js
const { result, error } = await deepgramClient.manage.getProjectMemberScopes(
  projectId,
  projectMemberId
);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/members/:memberId/scopes`

[See our API reference for more info](https://developers.deepgram.com/reference/get-member-scopes).

### Update Scope

Updates the scope for the specified member in the specified project.

```js
const { result, error } = await deepgramClient.manage.updateProjectMemberScope(
  projectId,
  projectMemberId,
  options
);
```

**API Endpoint**: `PUT https://api.deepgram.com/v1/projects/:projectId/members/:memberId/scopes`

[See our API reference for more info](https://developers.deepgram.com/reference/update-scope).

## Invitations

### List Invites

Retrieves all invitations associated with the provided project_id.

```js
const { result, error } = await deepgramClient.manage.getProjectInvites(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/invites`

[See our API reference for more info](https://developers.deepgram.com/reference/list-invites).

### Send Invite

Sends an invitation to the provided email address.

```js
const { result, error } = await deepgramClient.manage.sendProjectInvite(projectId, options);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/projects/:projectId/invites`

[See our API reference for more info](https://developers.deepgram.com/reference/send-invites).

### Delete Invite

Removes the specified invitation from the project.

```js
const { error } = await deepgramClient.manage.deleteProjectInvite(projectId, email);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId/invites/:email`

[See our API reference for more info](https://developers.deepgram.com/reference/delete-invite).

### Leave Project

Removes the authenticated user from the project.

```js
const { result, error } = await deepgramClient.manage.leaveProject(projectId);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId/leave`

[See our API reference for more info](https://developers.deepgram.com/reference/leave-project).

## Usage

### Get All Requests

Retrieves all requests associated with the provided project_id based on the provided options.

```js
const { result, error } = await deepgramClient.manage.getProjectUsageRequests(projectId, options);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/requests`

### Get Request

Retrieves a specific request associated with the provided project_id.

```js
const { result, error } = await deepgramClient.manage.getProjectUsageRequest(projectId, requestId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/requests/:requestId`

[See our API reference for more info](https://developers.deepgram.com/reference/get-request).

### Summarize Usage

Retrieves usage associated with the provided project_id based on the provided options.

```js
const { result, error } = await deepgramClient.manage.getProjectUsageSummary(projectId, options);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/usage`

[See our API reference for more info](https://developers.deepgram.com/reference/summarize-usage).

### Get Fields

Lists the features, models, tags, languages, and processing method used for requests in the specified project.

```js
const { result, error } = await deepgramClient.manage.getProjectUsageFields(projectId, options);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/usage/fields`

[See our API reference for more info](https://developers.deepgram.com/reference/get-fields).

### Summarize Usage

`Deprecated` Retrieves the usage for a specific project. Use Get Project Usage Breakdown for a more comprehensive usage summary.

```js
const { result, error } = await deepgramClient.manage.getProjectUsage(projectId, options);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/usage` (deprecated)

[See our API reference for more info](https://developers.deepgram.com/reference/management-api/usage/get).

## Billing

### Get All Balances

Retrieves the list of balance info for the specified project.

```js
const { result, error } = await deepgramClient.manage.getProjectBalances(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/balances`

[See our API reference for more info](https://developers.deepgram.com/reference/get-all-balances).

### Get Balance

Retrieves the balance info for the specified project and balance_id.

```js
const { result, error } = await deepgramClient.manage.getProjectBalance(projectId, balanceId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/balances/:balanceId`

[See our API reference for more info](https://developers.deepgram.com/reference/get-balance).

## Models

### Get All Models

Retrieves all models available globally.

```js
const { result, error } = await deepgramClient.models.getAll();
```

**API Endpoint**: `GET https://api.deepgram.com/v1/models`

### Get All Project Models

Retrieves all models available for a given project.

```js
const { result, error } = await deepgramClient.manage.getAllModels(projectId, {});
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/models`

[See our API reference for more info](https://developers.deepgram.com/reference/management-api/projects/list-models).

### Get Model

Retrieves details of a specific model.

```js
const { result, error } = await deepgramClient.manage.getModel(projectId, modelId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/models/:modelId`

[See our API reference for more info](https://developers.deepgram.com/reference/management-api/models/get)

## On-Prem APIs

### List On-Prem credentials

Lists sets of distribution credentials for the specified project.

```js
const { result, error } = await deepgramClient.onprem.listCredentials(projectId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/onprem/distribution/credentials`

[See our API reference for more info](https://developers.deepgram.com/reference/self-hosted-api/list-credentials)

### Get On-Prem credentials

Returns a set of distribution credentials for the specified project.

```js
const { result, error } = await deepgramClient.onprem.getCredentials(projectId, credentialId);
```

**API Endpoint**: `GET https://api.deepgram.com/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId`

[See our API reference for more info](https://developers.deepgram.com/reference/self-hosted-api/get-credentials)

### Create On-Prem credentials

Creates a set of distribution credentials for the specified project.

```js
const { result, error } = await deepgramClient.onprem.createCredentials(projectId, options);
```

**API Endpoint**: `POST https://api.deepgram.com/v1/projects/:projectId/onprem/distribution/credentials`

[See our API reference for more info](https://developers.deepgram.com/reference/self-hosted-api/create-credentials)

### Delete On-Prem credentials

Deletes a set of distribution credentials for the specified project.

```js
const { result, error } = await deepgramClient.onprem.deleteCredentials(projectId, credentialId);
```

**API Endpoint**: `DELETE https://api.deepgram.com/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId`

[See our API reference for more info](https://developers.deepgram.com/reference/self-hosted-api/delete-credentials)

## Backwards Compatibility

Older SDK versions will receive Priority 1 (P1) bug support only. Security issues, both in our code and dependencies, are promptly addressed. Significant bugs without clear workarounds are also given priority attention.

## Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

### Debugging and making changes locally

If you want to make local changes to the SDK and run the [`examples/`](./examples/), you'll need to `pnpm build` first, to ensure that your changes are included in the examples that are running.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue in this repository](https://github.com/deepgram/deepgram-node-sdk/issues/new)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
- [Join the Deepgram Github Discussions Community](https://github.com/orgs/deepgram/discussions)
