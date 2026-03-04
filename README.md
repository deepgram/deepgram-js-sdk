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

- **[API Reference](./reference.md)** - Complete reference for all SDK methods and parameters

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
connection.socket.send(audioData);
```

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

connection.sendAgentV1Settings({
  type: "Settings",
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
