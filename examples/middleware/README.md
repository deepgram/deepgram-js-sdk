# Deepgram SDK Middleware Examples

This directory contains reference implementations for using the Deepgram SDK middleware with various Node.js frameworks.

**Note:** These are **server examples** that start long-running processes. They are not run in CI and are meant for manual testing and reference.

## Quick Start

Run all middleware examples simultaneously (from the repository root):

```bash
export DEEPGRAM_API_KEY=your_api_key_here
make middleware
```

This will:
1. Install dependencies automatically
2. Start all 6 servers on different ports:
   - HTTP: http://localhost:3001/api/deepgram
   - Express: http://localhost:3002/api/deepgram
   - Fastify: http://localhost:3003/api/deepgram
   - Token Auth (HTTP): http://localhost:3004/api/deepgram
   - Token Auth (Express): http://localhost:3005/api/deepgram
   - Token Auth (Fastify): http://localhost:3006/api/deepgram
3. Press CTRL-C to stop all servers

## Manual Setup

If you prefer to run examples individually:

Install dependencies (from the `examples/middleware` directory):

```bash
cd examples/middleware
pnpm install
```

Set your Deepgram API key:

```bash
export DEEPGRAM_API_KEY=your_api_key_here
```

## Individual Examples

### Basic Proxy Examples

#### 1. Raw Node.js HTTP Server (`http.ts`)

**Zero dependencies** - Uses only Node.js built-in modules.

```bash
pnpm run http
# or with custom port:
PORT=3001 pnpm run http
```

This example demonstrates:
- Raw `http.createServer()` usage
- Custom routing logic
- WebSocket upgrade handling
- Maximum performance

**Access:** http://localhost:3000/api/deepgram

#### 2. Express Middleware (`express.ts`)

```bash
pnpm run express
```

This example demonstrates:
- Express middleware integration
- WebSocket handler registration
- Health check endpoint
- CORS setup

**Access:** http://localhost:3000/api/deepgram

#### 3. Fastify Plugin (`fastify.ts`)

```bash
pnpm run fastify
```

This example demonstrates:
- Fastify plugin registration
- Automatic WebSocket handling
- Route prefixing
- Health check endpoint

**Access:** http://localhost:3000/api/deepgram

### Token Authentication Examples

#### 4. Token Authentication - Raw HTTP (`token-auth-http.ts`)

**Zero dependencies** - Uses only Node.js built-in modules with token auth.

```bash
pnpm run token-auth-http
# or with custom port:
PORT=3004 pnpm run token-auth-http
```

This example demonstrates:
- Temporary token generation with raw HTTP
- Token-based client authentication
- Demo endpoint for testing token flow
- Security best practices

**Access:**
- Proxy: http://localhost:3000/api/deepgram
- Token endpoint: GET http://localhost:3000/api/deepgram/token
- Demo endpoint: POST http://localhost:3000/demo/transcribe

#### 5. Token Authentication - Express (`token-auth-express.ts`)

```bash
pnpm run token-auth-express
```

This example demonstrates:
- Temporary token generation with Express
- Token-based client authentication
- Demo endpoint for testing token flow
- Security best practices

**Access:**
- Proxy: http://localhost:3000/api/deepgram
- Token endpoint: GET http://localhost:3000/api/deepgram/token
- Demo endpoint: POST http://localhost:3000/demo/transcribe

#### 6. Token Authentication - Fastify (`token-auth-fastify.ts`)

```bash
pnpm run token-auth-fastify
```

This example demonstrates:
- Temporary token generation with Fastify
- Token-based client authentication
- Demo endpoint for testing token flow
- Security best practices

**Access:**
- Proxy: http://localhost:3000/api/deepgram
- Token endpoint: GET http://localhost:3000/api/deepgram/token
- Demo endpoint: POST http://localhost:3000/demo/transcribe

## Testing

### Browser SDK Examples (Recommended)

We provide interactive browser-based examples that use the real Deepgram SDK:

1. Start all servers with `make middleware` (from repository root)
2. Open one of the browser SDK examples:
   - **HTTP Proxy**: http://localhost:8000/browser-sdk-http.html
   - **Express Proxy**: http://localhost:8000/browser-sdk-express.html
   - **Fastify Proxy**: http://localhost:8000/browser-sdk-fastify.html

These examples demonstrate:
- Using the Deepgram SDK in the browser with the CDN build
- Configuring the SDK to use your local proxy server
- Making REST API transcription requests
- Complete integration with your proxy server

### Raw API Test Suite

We also provide a low-level test page that uses fetch directly (no SDK):

1. Start all servers with `make middleware` (from repository root)
2. Open http://localhost:8000/test.html
3. Select an endpoint from the six options:
   - Raw HTTP (basic proxy)
   - Express (basic proxy)
   - Fastify (basic proxy)
   - HTTP + Token (token authentication)
   - Express + Token (token authentication)
   - Fastify + Token (token authentication)
4. Click "Test REST API" or "Test WebSocket" to verify functionality

The test page will:
- Automatically handle token authentication flow for token auth servers
- Send a sample REST transcription request
- Establish a WebSocket connection and send test audio
- Display detailed logs of all requests and responses
- Show success/failure status for each test

### Testing with the Deepgram SDK

You can also test programmatically with the Deepgram SDK:

```typescript
import { DeepgramClient } from '@deepgram/sdk';

const client = new DeepgramClient({
  apiKey: 'Dummy key for SDK proxying', // Detected by proxy, server-side key used instead
  baseUrl: 'http://localhost:3000/api/deepgram'
});

// REST API
const result = await client.listen.v1.media.transcribeUrl({
  url: 'https://dpgr.am/spacewalk.wav'
});

// WebSocket
const connection = await client.listen.v1.connect({
  model: 'nova-3'
});
```

Or test with curl:

```bash
# Health check
curl http://localhost:3000/health

# Request temporary token (token-auth example only)
curl -X GET http://localhost:3000/api/deepgram/token

# Test transcription (token-auth demo endpoint)
curl -X POST http://localhost:3000/demo/transcribe \
  -H "Content-Type: application/json" \
  -d '{"url": "https://dpgr.am/spacewalk.wav"}'
```

## Configuration

All examples support these environment variables:

- `DEEPGRAM_API_KEY` (required) - Your Deepgram API key
- `PORT` (optional, default: 3000) - Server port

## Production Deployment

These examples are for **development and reference only**. For production:

1. ✅ Use HTTPS (not HTTP)
2. ✅ Add rate limiting
3. ✅ Add request logging
4. ✅ Set appropriate CORS policies
5. ✅ Use environment-specific configuration
6. ✅ Add health checks and monitoring
7. ✅ Handle graceful shutdown properly

See the main [middleware documentation](../../src/middleware/README.md) for more details.
