# Deepgram SDK Middleware

Proxy middleware for the Deepgram API, supporting raw Node.js HTTP/HTTPS servers, Express, and Fastify.

## Installation

### With Raw Node.js (No Dependencies!)

```bash
npm install @deepgram/sdk
# or
pnpm add @deepgram/sdk
```

No additional dependencies needed! Uses only Node.js built-in modules.

### With Express

```bash
npm install @deepgram/sdk express
# or
pnpm add @deepgram/sdk express
```

### With Fastify

```bash
npm install @deepgram/sdk fastify fastify-plugin
# or
pnpm add @deepgram/sdk fastify fastify-plugin
```

## Features

- ✅ **REST API Proxying** - Proxy all Deepgram REST API endpoints
- ✅ **WebSocket Support** - Proxy Live, Speak, and Agent WebSocket connections
- ✅ **API Key Injection** - Hide your API key on the server side
- ✅ **Temporary Token Auth** - Generate and validate temporary access tokens for clients
- ✅ **Framework Support** - Works with raw Node.js, Express, Fastify, or any HTTP framework

## Usage

### Raw Node.js HTTP/HTTPS

For maximum performance and minimal dependencies, use the raw HTTP adapter:

```typescript
import http from 'node:http';
import { createDeepgramHttpServer } from '@deepgram/sdk';

// Create handlers
const { handler, upgradeHandler } = createDeepgramHttpServer({
  apiKey: process.env.DEEPGRAM_API_KEY!,
  enableTokenAuth: true
});

// Create server
const server = http.createServer(handler);

// Register WebSocket handler
server.on('upgrade', upgradeHandler);

server.listen(3000);
```

**Advantages:**
- ✅ Zero dependencies (only built-in modules)
- ✅ Maximum performance
- ✅ Full control over routing
- ✅ Minimal memory footprint

### Express

```typescript
import express from 'express';
import { createDeepgramMiddleware } from '@deepgram/sdk';

const app = express();

// Create middleware and WebSocket handler
const { middleware, server } = createDeepgramMiddleware({
  apiKey: process.env.DEEPGRAM_API_KEY!,
  enableTokenAuth: true,  // Optional: enable temporary tokens
  tokenExpiresIn: 600     // Optional: token lifetime in seconds (default: 300)
});

// Mount the middleware
app.use('/api/deepgram', middleware);

// Start server with WebSocket support
const httpServer = app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});

// Register WebSocket handler
server(httpServer);
```

### Fastify

```typescript
import Fastify from 'fastify';
import { fastifyDeepgramProxy } from '@deepgram/sdk';

const fastify = Fastify();

// Register the plugin
fastify.register(fastifyDeepgramProxy, {
  prefix: '/api/deepgram',
  apiKey: process.env.DEEPGRAM_API_KEY!,
  enableTokenAuth: true,
  tokenExpiresIn: 600
});

fastify.listen({ port: 3000 });
```

## Configuration Options

```typescript
interface MiddlewareOptions {
  /**
   * Deepgram API key (required)
   * This key is used server-side and never exposed to clients
   */
  apiKey: string;

  /**
   * Enable temporary token authentication (optional, default: false)
   * When enabled, clients can request temporary tokens via GET /token
   */
  enableTokenAuth?: boolean;

  /**
   * Token expiration time in seconds (optional, default: 300)
   * Only used when enableTokenAuth is true
   */
  tokenExpiresIn?: number;

  /**
   * Custom Deepgram API base URL (optional)
   * Useful for self-hosted or regional endpoints
   */
  deepgramUrl?: string;
}
```

## Authentication Modes

### Mode 1: Server-Side API Key (Default)

The simplest mode - the API key is injected by the middleware and never exposed to clients.

**Server:**
```typescript
app.use('/api/deepgram', createDeepgramMiddleware({
  apiKey: process.env.DEEPGRAM_API_KEY!
}).middleware);
```

**Client:**
```typescript
const client = new DeepgramClient({
  apiKey: 'proxy',  // Placeholder, ignored by middleware
  baseUrl: 'http://localhost:3000/api/deepgram'
});

const result = await client.listen.v1.media.transcribeUrl({
  url: 'https://example.com/audio.mp3'
});
```

### Mode 2: Temporary Token Auth

For enhanced security, clients can request temporary tokens that expire.

**Server:**
```typescript
app.use('/api/deepgram', createDeepgramMiddleware({
  apiKey: process.env.DEEPGRAM_API_KEY!,
  enableTokenAuth: true,
  tokenExpiresIn: 600  // 10 minutes
}).middleware);
```

**Client:**
```typescript
// Step 1: Request a temporary token
const response = await fetch('http://localhost:3000/api/deepgram/token', {
  method: 'GET'
});
const { token } = await response.json();

// Step 2: Use the token with the SDK
const client = new DeepgramClient({
  apiKey: token,
  baseUrl: 'http://localhost:3000/api/deepgram'
});

const result = await client.listen.v1.media.transcribeUrl({
  url: 'https://example.com/audio.mp3'
});
```

## WebSocket Support

The middleware automatically handles WebSocket upgrade requests for:

- **Live Transcription** (`/v1/listen`, `/v2/listen`)
- **Text-to-Speech Streaming** (`/v1/speak`)
- **Voice Agent** (`/v1/agent`)

### Express WebSocket Setup

```typescript
import { createDeepgramMiddleware } from '@deepgram/sdk';

const { middleware, server } = createDeepgramMiddleware({
  apiKey: process.env.DEEPGRAM_API_KEY!
});

app.use('/api/deepgram', middleware);

const httpServer = app.listen(3000);
server(httpServer);  // Registers WebSocket handler
```

### Fastify WebSocket Setup

```typescript
// WebSocket support is automatic with Fastify plugin
fastify.register(fastifyDeepgramProxy, {
  prefix: '/api/deepgram',
  apiKey: process.env.DEEPGRAM_API_KEY!
});
```

## Examples

See the `examples/` directory for complete working examples:

- `examples/middleware/http.ts` - Raw Node.js HTTP server (zero dependencies!)
- `examples/middleware/express.ts` - Express middleware example
- `examples/middleware/fastify.ts` - Fastify plugin example
- `examples/middleware/token-auth.ts` - Temporary token authentication

## Security Considerations

### API Key Protection

✅ **DO:** Store API keys in environment variables or secrets management
✅ **DO:** Use HTTPS in production to encrypt traffic
✅ **DO:** Enable token auth for client applications

❌ **DON'T:** Commit API keys to version control
❌ **DON'T:** Expose API keys in client-side code
❌ **DON'T:** Use long-lived tokens in browsers

### Token Authentication

When `enableTokenAuth` is enabled:

- Tokens are generated server-side using the Deepgram API
- Tokens automatically expire (default: 5 minutes)
- Clients can request new tokens when expired
- Tokens are scoped to your project permissions

### CORS

The middleware doesn't automatically handle CORS. Add CORS middleware before the Deepgram proxy:

**Express:**
```typescript
import cors from 'cors';

app.use(cors());
app.use('/api/deepgram', middleware);
```

**Fastify:**
```typescript
import fastifyCors from '@fastify/cors';

fastify.register(fastifyCors);
fastify.register(fastifyDeepgramProxy, { prefix: '/api/deepgram', ... });
```

## Deployment

### Environment Variables

```bash
# Required
DEEPGRAM_API_KEY=your_api_key_here

# Optional
DEEPGRAM_PROXY_PORT=3000
DEEPGRAM_PROXY_PREFIX=/api/deepgram
ENABLE_TOKEN_AUTH=true
TOKEN_EXPIRES_IN=600
```

### Production Checklist

- [ ] Use HTTPS (not HTTP)
- [ ] Set secure CORS policies
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Monitor token usage
- [ ] Set appropriate token expiration times
- [ ] Use environment-specific API keys

## Troubleshooting

### "Cannot find module 'express'" or "Cannot find module 'fastify'"

Install the required peer dependencies:

```bash
npm install express        # For Express
npm install fastify fastify-plugin  # For Fastify
```

### WebSocket connections not working

**Express:** Make sure you're registering the upgrade handler on the HTTP server, not the Express app:

```typescript
const httpServer = app.listen(3000);
server(httpServer);  // ✅ Correct

// NOT: app.on('upgrade', ...)  ❌ Wrong
```

**Fastify:** The WebSocket handler is automatically registered when you register the plugin.

### Tokens expiring too quickly

Increase the `tokenExpiresIn` value:

```typescript
{
  enableTokenAuth: true,
  tokenExpiresIn: 3600  // 1 hour
}
```

### CORS errors in browser

Add CORS middleware before the Deepgram proxy:

```typescript
import cors from 'cors';
app.use(cors());
app.use('/api/deepgram', middleware);
```

## License

MIT
