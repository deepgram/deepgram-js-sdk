# Deepgram API TypeScript Library

![](https://developers.deepgram.com)

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Fdeepgram%2Fdeepgram-js-sdk)
[![npm shield](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk)

Power your apps with world-class speech and Language AI models

## Documentation

API reference documentation is available [here](https://developers.deepgram.com/reference/deepgram-api-overview).

## Migrating from earlier versions

### V2 to V3

We have published [a migration guide on our docs](https://developers.deepgram.com/docs/js-sdk-v2-to-v3-migration-guide), showing how to move from v2 to v3.

### V3.\* to V3.4

We recommend using only documented interfaces, as we strictly follow semantic versioning (semver) and breaking changes may occur for undocumented interfaces. To ensure compatibility, consider pinning your versions if you need to use undocumented interfaces.

### V3.\* to V4

The Voice Agent interfaces have been updated to use the new Voice Agent V1 API. Please refer to our [Documentation](https://developers.deepgram.com/docs/voice-agent-v1-migration) on Migration to new V1 Agent API.

## Installation

```sh
npm i -s @deepgram/sdk
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

## Reference

A full reference for this library is available [here](https://github.com/deepgram/deepgram-js-sdk/blob/HEAD/./reference.md).

## Usage

Instantiate and use the client with the following:

```typescript
import { createReadStream } from "fs";
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({ apiKey: "YOUR_API_KEY" });
await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), {});
```

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

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Deepgram } from "@deepgram/sdk";

const request: Deepgram.GrantV1Request = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { DeepgramError } from "@deepgram/sdk";

try {
    await client.listen.v1.media.transcribeFile(...);
} catch (err) {
    if (err instanceof DeepgramError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## File Uploads

You can upload files using the client:

```typescript
import { createReadStream } from "fs";

await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), ...);
await client.listen.v1.media.transcribeFile(new ReadableStream(), ...);
await client.listen.v1.media.transcribeFile(Buffer.from('binary data'), ...);
await client.listen.v1.media.transcribeFile(new Blob(['binary data'], { type: 'audio/mpeg' }), ...);
await client.listen.v1.media.transcribeFile(new File(['binary data'], 'file.mp3'), ...);
await client.listen.v1.media.transcribeFile(new ArrayBuffer(8), ...);
await client.listen.v1.media.transcribeFile(new Uint8Array([0, 1, 2]), ...);
```
The client accepts a variety of types for file upload parameters:
* Stream types: `fs.ReadStream`, `stream.Readable`, and `ReadableStream`
* Buffered types: `Buffer`, `Blob`, `File`, `ArrayBuffer`, `ArrayBufferView`, and `Uint8Array`

### Metadata

You can configure metadata when uploading a file:
```typescript
const file: Uploadable.WithMetadata = {
    data: createReadStream("path/to/file"),
    filename: "my-file",       // optional
    contentType: "audio/mpeg", // optional
    contentLength: 1949,       // optional
};
```

Alternatively, you can upload a file directly from a file path:
```typescript
const file : Uploadable.FromPath = {
    path: "path/to/file",
    filename: "my-file",        // optional
    contentType: "audio/mpeg",  // optional
    contentLength: 1949,        // optional
};
```

The metadata is used to set the `Content-Length`, `Content-Type`, and `Content-Disposition` headers. If not provided, the client will attempt to determine them automatically.
For example, `fs.ReadStream` has a `path` property which the SDK uses to retrieve the file size from the filesystem without loading it into memory.


## Binary Response

You can consume binary data from endpoints using the `BinaryResponse` type which lets you choose how to consume the data:

```typescript
const response = await client.speak.v1.audio.generate(...);
const stream: ReadableStream<Uint8Array> = response.stream();
// const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
// const blob: Blob = response.blob();
// const bytes: Uint8Array = response.bytes();
// You can only use the response body once, so you must choose one of the above methods.
// If you want to check if the response body has been used, you can use the following property.
const bodyUsed = response.bodyUsed;
```
<details>
<summary>Save binary response to a file</summary>

<blockquote>
<details>
<summary>Node.js</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const nodeStream = Readable.fromWeb(stream);
const writeStream = createWriteStream('path/to/file');

await pipeline(nodeStream, writeStream);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await writeFile('path/to/file', Buffer.from(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const arrayBuffer = await blob.arrayBuffer();
await writeFile('output.bin', Buffer.from(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await writeFile('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Bun</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
await Bun.write('path/to/file', stream);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await Bun.write('path/to/file', arrayBuffer);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
await Bun.write('path/to/file', blob);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await Bun.write('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Deno</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const file = await Deno.open('path/to/file', { write: true, create: true });
await stream.pipeTo(file.writable);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await Deno.writeFile('path/to/file', new Uint8Array(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const arrayBuffer = await blob.arrayBuffer();
await Deno.writeFile('path/to/file', new Uint8Array(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await Deno.writeFile('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Browser</summary>

<blockquote>
<details>
<summary>Blob (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ReadableStream</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const reader = stream.getReader();
const chunks = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunks.push(value);
}

const blob = new Blob(chunks);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
const blob = new Blob([arrayBuffer]);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
const blob = new Blob([bytes]);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

</details>
</blockquote>

</details>
</blockquote>

<details>
<summary>Convert binary response to text</summary>

<blockquote>
<details>
<summary>ReadableStream</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const text = await new Response(stream).text();
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
const text = new TextDecoder().decode(arrayBuffer);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const text = await blob.text();
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
const text = new TextDecoder().decode(bytes);
```

</details>
</blockquote>

</details>

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    queryParams: {
        'customQueryParamKey': 'custom query param value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.listen.v1.media.transcribeFile(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.listen.v1.media.transcribeFile(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Logging

The SDK supports logging. You can configure the logger by passing in a `logging` object to the client options.

```typescript
import { DeepgramClient, logging } from "@deepgram/sdk";

const client = new DeepgramClient({
    ...
    logging: {
        level: logging.LogLevel.Debug, // defaults to logging.LogLevel.Info
        logger: new logging.ConsoleLogger(), // defaults to ConsoleLogger
        silent: false, // defaults to true, set to false to enable logging
    }
});
```
The `logging` object can have the following properties:
- `level`: The log level to use. Defaults to `logging.LogLevel.Info`.
- `logger`: The logger to use. Defaults to a `logging.ConsoleLogger`.
- `silent`: Whether to silence the logger. Defaults to `true`.

The `level` property can be one of the following values:
- `logging.LogLevel.Debug`
- `logging.LogLevel.Info`
- `logging.LogLevel.Warn`
- `logging.LogLevel.Error`

To provide a custom logger, you can pass in an object that implements the `logging.ILogger` interface.

<details>
<summary>Custom logger examples</summary>

Here's an example using the popular `winston` logging library.
```ts
import winston from 'winston';

const winstonLogger = winston.createLogger({...});

const logger: logging.ILogger = {
    debug: (msg, ...args) => winstonLogger.debug(msg, ...args),
    info: (msg, ...args) => winstonLogger.info(msg, ...args),
    warn: (msg, ...args) => winstonLogger.warn(msg, ...args),
    error: (msg, ...args) => winstonLogger.error(msg, ...args),
};
```

Here's an example using the popular `pino` logging library.

```ts
import pino from 'pino';

const pinoLogger = pino({...});

const logger: logging.ILogger = {
  debug: (msg, ...args) => pinoLogger.debug(args, msg),
  info: (msg, ...args) => pinoLogger.info(args, msg),
  warn: (msg, ...args) => pinoLogger.warn(args, msg),
  error: (msg, ...args) => pinoLogger.error(args, msg),
};
```
</details>


### Runtime Compatibility


The SDK works in the following runtimes:



- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!