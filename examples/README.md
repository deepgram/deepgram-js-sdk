# Deepgram JavaScript SDK Examples

This directory contains comprehensive examples demonstrating how to use the Deepgram JavaScript SDK. These examples are based on the existing SDK API signature and cover all major use cases.

## Examples Overview

### Authentication
- **01-authentication-api-key.js** - API key authentication (3 methods)
- **02-authentication-access-token.js** - Access token authentication
- **03-authentication-proxy.js** - Proxy authentication for browser environments

### Transcription
- **04-transcription-prerecorded-url.js** - Transcribe audio from URL
- **05-transcription-prerecorded-file.js** - Transcribe audio from local file
- **06-transcription-prerecorded-callback.js** - Async transcription with callbacks
- **07-transcription-live-websocket.js** - Live transcription via WebSocket
- **08-transcription-captions.js** - Convert transcriptions to WebVTT/SRT captions
- **22-transcription-advanced-options.js** - Advanced transcription options

### Voice Agent
- **09-voice-agent.js** - Voice Agent configuration and usage

### Text-to-Speech
- **10-text-to-speech-single.js** - Single request TTS
- **11-text-to-speech-streaming.js** - Streaming TTS via WebSocket

### Text Intelligence
- **12-text-intelligence.js** - Text analysis using AI features

### Management API
- **13-management-projects.js** - Project management (list, get, update, delete)
- **14-management-keys.js** - API key management (list, get, create, delete)
- **15-management-members.js** - Member management (list, remove, scopes)
- **16-management-invites.js** - Invitation management (list, send, delete, leave)
- **17-management-usage.js** - Usage statistics and request information
- **18-management-billing.js** - Billing and balance information
- **19-management-models.js** - Model information

### On-Premises
- **20-onprem-credentials.js** - On-premises credentials management

### Configuration & Advanced
- **21-configuration-scoped.js** - Scoped configuration examples
- **23-file-upload-types.js** - Different file upload types
- **24-error-handling.js** - Error handling patterns
- **25-request-options.js** - Advanced request options (headers, retries, timeouts)
- **26-logging.js** - Logging configuration
- **27-binary-response.js** - Binary response handling

## Usage

1. Install dependencies:
```bash
pnpm install
```

2. Set your API key and Project ID as an environment variable:
```bash
export 
export 
```

3. Run an example:
```bash
DEEPGRAM_API_KEY="your-api-key-here" DEEPGRAM_PROJECT_ID="your-id-here" make example-1
```

4. OR run all:
```bash
DEEPGRAM_API_KEY="your-api-key-here" DEEPGRAM_PROJECT_ID="your-id-here" make examples
```

## Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

## Documentation

For more information, see:
- [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)
- [SDK README](../README.md)
- [Reference Documentation](../reference.md)

## Notes

- All examples use the existing SDK signature (`createClient`) as documented in the README
- Examples are commented out by default - uncomment the function calls to run them
- Replace placeholder values (YOUR_DEEPGRAM_API_KEY, YOUR_PROJECT_ID, etc.) with actual values
- Some examples require specific file paths or URLs - adjust as needed for your environment

