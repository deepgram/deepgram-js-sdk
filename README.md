# Deepgram JavaScript SDK

![Built with Fern](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)
[![npm version](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk)
[![Node.js 18+](https://img.shields.io/badge/node-18+-blue.svg)](https://nodejs.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

The official JavaScript/TypeScript SDK for Deepgram's automated speech recognition, text-to-speech, and language understanding APIs. Power your applications with world-class speech and Language AI models.

## Documentation

Comprehensive API documentation and guides are available at [developers.deepgram.com](https://developers.deepgram.com).

### Migrating From Earlier Versions

- [v2 to v3](./docs/Migrating-v2-to-v3.md)
- [v3 to v4](./docs/Migrating-v3-to-v4.md)
- [v4 to v5](./docs/Migrating-v4-to-v5.md) (current)

## Installation

Install the Deepgram JavaScript SDK using npm:

```bash
npm install @deepgram/sdk
```

## Reference

- **[REST API Reference](./reference.md)** - Fern-generated methods and parameters for HTTP endpoints

### Streaming WebSocket API

Every streaming client exposes both `connect()` and `createConnection()`. They are aliases that return a start-closed socket: register handlers, call the socket's `connect()`, and then await `waitForOpen()` before sending data.

All sockets expose `on("open" | "message" | "close" | "error", callback)`, `connect()`, `waitForOpen()`, `close()`, `readyState`, and a lower-level `socket` property. Prefer the typed send methods below instead of calling `socket.send()` directly.

| Service | Create a socket | Typed send methods |
| --- | --- | --- |
| [Voice Agent v1](./src/api/resources/agent/resources/v1/client/Socket.ts) | `client.agent.v1.connect()` or `.createConnection()` | `sendSettings`, `sendUpdateListen`, `sendUpdateThink`, `sendUpdateSpeak`, `sendInjectUserMessage`, `sendInjectAgentMessage`, `sendFunctionCallResponse`, `sendKeepAlive`, `sendUpdatePrompt`, `sendMedia` |
| [Speech-to-Text v1](./src/api/resources/listen/resources/v1/client/Socket.ts) | `client.listen.v1.connect(args)` or `.createConnection(args)` | `sendMedia`, `sendFinalize`, `sendCloseStream`, `sendKeepAlive` |
| [Conversational STT v2](./src/api/resources/listen/resources/v2/client/Socket.ts) | `client.listen.v2.connect(args)` or `.createConnection(args)` | `sendMedia`, `sendCloseStream`, `sendForceEndTurn`, `sendConfigure` |
| [Text-to-Speech v1](./src/api/resources/speak/resources/v1/client/Socket.ts) | `client.speak.v1.connect(args)` or `.createConnection(args)` | `sendText`, `sendFlush`, `sendClear`, `sendClose` |
| [Flux TTS v2](./src/api/resources/speak/resources/v2/client/Socket.ts) | `client.speak.v2.connect(args)` or `.createConnection(args)` | `sendSpeak`, `sendFlush`, `sendInterrupt`, `sendConfigure`, `sendClose` |

The public connection argument types and Deepgram-specific wrapper behavior are defined in [`src/CustomClient.ts`](./src/CustomClient.ts). Use the linked socket classes for exact message and event types.

## Usage

### Quick Start

The Deepgram SDK provides clients for all major use cases:

#### Real-time Speech Recognition (Listen v1)

Connect to our WebSocket and transcribe live streaming audio:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();

const connection = await client.listen.v1.connect({
  model: "nova-3",
  language: "en",
  punctuate: "true",
  interim_results: "true",
});

connection.on("open", () => console.log("Connection opened"));

connection.on("message", (data) => {
  if (data.type === "Results") {
    console.log(data);
  }
});

connection.connect();
await connection.waitForOpen();

// Send audio data
connection.sendMedia(audioData);
```

Pass an `abortSignal` to stop a connection attempt or active session and disable automatic reconnection. If you await `waitForOpen()`, make that wait abort-aware as shown in [Canceling a WebSocket Connection (AbortSignal)](#canceling-a-websocket-connection-abortsignal).

#### File Transcription

Transcribe pre-recorded audio files ([API Reference](./reference.md)):

```typescript
import { createReadStream } from "fs";
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();

const response = await client.listen.v1.media.transcribeFile(
  createReadStream("audio.wav"),
  { model: "nova-3" }
);
console.log(response.results.channels[0].alternatives[0].transcript);
```

#### Text-to-Speech

Generate natural-sounding speech from text ([API Reference](./reference.md)):

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();

const response = await client.speak.v1.audio.generate({
  text: "Hello, this is a sample text to speech conversion.",
  model: "aura-2-thalia-en",
  encoding: "linear16",
  container: "wav",
});

// Save the audio file
const stream = response.stream();
```

#### Text Analysis

Analyze text for sentiment, topics, and intents ([API Reference](./reference.md)):

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();

const response = await client.read.v1.text.analyze({
  text: "Hello, world!",
  language: "en",
});
```

#### Voice Agent (Conversational AI)

Build interactive voice agents:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();

const connection = await client.agent.v1.connect();

connection.on("open", () => console.log("Connection opened"));

connection.on("message", (data) => {
  if (data.type === "ConversationText") {
    console.log(data);
  }
});

connection.connect();
await connection.waitForOpen();

connection.sendSettings({
  type: "Settings",
  audio: {
    input: { encoding: "linear16", sample_rate: 24000 },
    output: { encoding: "linear16", sample_rate: 16000, container: "wav" },
  },
  agent: {
    language: "en",
    listen: {
      provider: { type: "deepgram", version: "v1", model: "nova-3" },
    },
    think: {
      provider: { type: "open_ai", model: "gpt-4o-mini" },
      prompt: "You are a friendly AI assistant.",
    },
    speak: {
      provider: { type: "deepgram", model: "aura-2-thalia-en" },
    },
  },
});
```

## Authentication

The Deepgram SDK supports two authentication methods:

### API Key Authentication

Use your Deepgram API key for server-side applications:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Explicit API key
const client = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// Or via environment variable DEEPGRAM_API_KEY
const client = new DeepgramClient();
```

### Access Token Authentication

Use access tokens for temporary or scoped access (recommended for client-side applications):

```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Explicit access token
const client = new DeepgramClient({ accessToken: "YOUR_ACCESS_TOKEN" });

// Or via environment variable DEEPGRAM_ACCESS_TOKEN
const client = new DeepgramClient();

// Generate access tokens using your API key
const authClient = new DeepgramClient({ apiKey: "YOUR_API_KEY" });
const tokenResponse = await authClient.auth.v1.tokens.grant();
const tokenClient = new DeepgramClient({ accessToken: tokenResponse.access_token });
```

### Environment Variables

The SDK automatically discovers credentials from these environment variables:

- `DEEPGRAM_ACCESS_TOKEN` - Your access token (takes precedence)
- `DEEPGRAM_API_KEY` - Your Deepgram API key

**Precedence:** Explicit parameters > Environment variables

### Getting an API Key

To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

## Browser Usage

The SDK works in modern browsers with some considerations:

### WebSocket Features (Full Support)

- **Live Transcription**: Direct connection to `wss://api.deepgram.com`
- **Voice Agent**: Direct connection to `wss://agent.deepgram.com`
- **Live Text-to-Speech**: Direct connection to `wss://api.deepgram.com`

### REST API Features (Proxy Required)

Due to CORS header restrictions in the Deepgram API, you must use a proxy server when making REST API calls from browsers. Pass `"proxy"` as your API key and point `baseUrl` to your proxy:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
  apiKey: "proxy",
  baseUrl: "http://localhost:8080",
});
```

Your proxy must set the `Authorization: token DEEPGRAM_API_KEY` header and forward requests to Deepgram's API. See our example [Deepgram Node Proxy](https://github.com/deepgram-devs/deepgram-node-proxy).

### Setup Options

```html
<!-- CDN (UMD) -->
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
<script>
  const { DeepgramClient } = deepgram;
</script>

<!-- CDN (ESM) -->
<script type="module">
  import { DeepgramClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
</script>
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx), a `DeepgramError` is thrown:

```typescript
import { DeepgramClient, DeepgramError } from "@deepgram/sdk";

const client = new DeepgramClient();

try {
  await client.listen.v1.media.transcribeFile(audioData, { model: "nova-3" });
} catch (err) {
  if (err instanceof DeepgramError) {
    console.log(err.statusCode);
    console.log(err.message);
    console.log(err.body);
  }
}
```

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces:

```typescript
// Direct import (recommended)
import { ListenV1Response, SpeakV1Response } from "@deepgram/sdk";

// Or via namespace
import { Deepgram } from "@deepgram/sdk";
type Response = Deepgram.ListenV1Response;
```

## Advanced Features

### Request Configuration

Configure timeouts, retries, and other request options:

```typescript
const response = await client.listen.v1.media.transcribeFile(audioData, {
  model: "nova-3",
  timeoutInSeconds: 60,
  maxRetries: 3,
});
```

### Canceling a WebSocket Connection (AbortSignal)

All real-time `connect()` methods — `listen.v1.connect()`, `listen.v2.connect()`,
`agent.v1.connect()`, `speak.v1.connect()`, and `speak.v2.connect()` — accept an
`abortSignal`. Use it when cancellation must be controlled outside the connection owner,
such as in apps that start and stop sessions rapidly.

When the signal aborts, the SDK stops the pending or active transport and disables automatic
reconnection. A registered `close` callback can run as part of cancellation. AbortSignal does
not clear callbacks registered with `connection.on()`, and `waitForOpen()` does not observe the
signal directly. If a connection can be canceled while opening, make the wait abort-aware:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient();
const controller = new AbortController();

function waitForOpenOrAbort(
  connection: { waitForOpen(): Promise<unknown> },
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => signal.removeEventListener("abort", onAbort);
    const onAbort = () => {
      cleanup();
      reject(signal.reason ?? new Error("Connection aborted"));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
    connection.waitForOpen().then(
      () => {
        cleanup();
        resolve();
      },
      (error) => {
        cleanup();
        reject(error);
      },
    );
  });
}

const connection = await client.listen.v1.connect({
  model: "nova-3",
  language: "en",
  abortSignal: controller.signal,
});

connection.on("open", () => console.log("Connection opened"));
connection.on("message", (data) => console.log(data));

connection.connect();
await waitForOpenOrAbort(connection, controller.signal);

// Cancel the session later. If this happens before open, the helper above rejects.
controller.abort();
```

An aborted signal is terminal for that connection. To start a new session, create a fresh
`AbortController` and connection. AbortSignal does not provide `removeAllListeners()`; manage
the lifecycle of callbacks registered on the old connection separately.

### Access Raw Response Data

```typescript
const { data, rawResponse } = await client.listen.v1.media
  .transcribeFile(audioData, { model: "nova-3" })
  .withRawResponse();

console.log(rawResponse.headers["X-My-Header"]);
```

### Custom Fetch Client

Use a custom fetch implementation for unsupported environments:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  fetcher: yourCustomFetchImplementation,
});
```

### WebSocket Proxy / Custom HTTP Agent

In Node.js you can route streaming WebSocket connections (`listen`, `speak`, `agent`)
through any compatible custom `http.Agent` implementation. For example, install a
Node 18-compatible version of `https-proxy-agent`:

```bash
npm install https-proxy-agent@8
```

Then create an `HttpsProxyAgent` to route traffic through a corporate HTTP/HTTPS
egress proxy. Set `agent` on the client to apply it to every connection, or pass it
per connection to override the client-level default:

```typescript
import { DeepgramClient } from "@deepgram/sdk";
import { HttpsProxyAgent } from "https-proxy-agent";

const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY!);

// Applies to every streaming connection from this client.
const client = new DeepgramClient({ apiKey: "YOUR_API_KEY", agent });

// ...or per connection (overrides the client-level agent).
const socket = await client.listen.v1.createConnection({ model: "nova-3", agent });
```

The `agent` option is Node-only; it is ignored in browser and web-worker runtimes,
which use the native `WebSocket` and cannot accept a custom agent.

### Logging

```typescript
import { DeepgramClient, logging } from "@deepgram/sdk";

const client = new DeepgramClient({
  apiKey: "YOUR_API_KEY",
  logging: {
    level: logging.LogLevel.Debug,
    logger: new logging.ConsoleLogger(),
    silent: false,
  },
});
```

### Runtime Compatibility

The SDK works in the following runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Contributing

We welcome contributions to improve this SDK! However, please note that this library is primarily generated from our API specifications.

### Development Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Build**:

   ```bash
   make build
   ```

3. **Run tests**:

   ```bash
   make test
   ```

### Contribution Guidelines

See our [CONTRIBUTING](./CONTRIBUTING.md) guide.

## Backwards Compatibility

Older SDK versions will receive Priority 1 (P1) bug support only. Security issues, both in our code and dependencies, are promptly addressed. Significant bugs without clear workarounds are also given priority attention.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know!

- [Open an issue on GitHub](https://github.com/deepgram/deepgram-js-sdk/issues/new)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
- [Join the Deepgram GitHub Discussions](https://github.com/orgs/deepgram/discussions)

## Community Code of Conduct

Please see our community [code of conduct](https://developers.deepgram.com/code-of-conduct) before contributing to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
