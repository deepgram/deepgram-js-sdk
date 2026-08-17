# Deepgram JavaScript SDK Examples

This directory contains comprehensive examples demonstrating how to use the Deepgram JavaScript SDK. These examples are based on the existing SDK API signature and cover all major use cases.

## Examples Overview

### Authentication
- **01-authentication-api-key.ts** - API key authentication (3 methods)
- **02-authentication-access-token.ts** - Access token authentication
- **03-authentication-proxy.ts** - Proxy authentication for browser environments

### Transcription
- **04-transcription-prerecorded-url.ts** - Transcribe audio from URL
- **05-transcription-prerecorded-file.ts** - Transcribe audio from local file
- **06-transcription-prerecorded-callback.ts** - Async transcription with callbacks
- **07-transcription-live-websocket.ts** - Live transcription via WebSocket
- **08-transcription-captions.ts** - Convert transcriptions to WebVTT/SRT captions
- **22-transcription-advanced-options.ts** - Advanced transcription options
- **26-transcription-live-websocket-v2.ts** - Live transcription via WebSocket V2

### Voice Agent
- **09-voice-agent.ts** - Voice Agent configuration and usage
- **34-agent-custom-providers.ts** - Voice Agent with custom third-party providers
- **35-agent-provider-combinations.ts** - Voice Agent provider combinations
- **36-agent-inject-message.ts** - Injecting agent and user messages into an active session

### Text-to-Speech
- **10-text-to-speech-single.ts** - Single request TTS
- **11-text-to-speech-streaming.ts** - Streaming TTS via WebSocket

### Text Intelligence
- **12-text-intelligence.ts** - Text analysis using AI features
- **28-text-intelligence-advanced.ts** - Advanced text intelligence options

### Management API
- **13-management-projects.ts** - Project management (list, get, update, delete)
- **14-management-keys.ts** - API key management (list, get, create, delete)
- **15-management-members.ts** - Member management (list, remove, scopes)
- **16-management-invites.ts** - Invitation management (list, send, delete, leave)
- **17-management-usage.ts** - Usage statistics and request information
- **18-management-billing.ts** - Billing and balance information
- **19-management-models.ts** - Model information
- **29-management-usage-breakdown.ts** - Usage breakdown details
- **30-management-billing-detailed.ts** - Detailed billing information
- **31-management-member-permissions.ts** - Member permissions management
- **32-management-project-models.ts** - Project-specific model information

### On-Premises
- **20-onprem-credentials.ts** - On-premises credentials management

### Configuration & Advanced
- **21-configuration-scoped.ts** - Scoped configuration examples
- **23-file-upload-types.ts** - Different file upload types
- **24-error-handling.ts** - Error handling patterns
- **25-binary-response.ts** - Binary response handling
- **27-deepgram-session-header.ts** - Deepgram session header usage
- **33-configuration-eu-endpoint.ts** - EU endpoint configuration

## Usage

1. Install dependencies:
```bash
pnpm install
```

2. Set your API key and Project ID as environment variables:
```bash
export DEEPGRAM_API_KEY="your-api-key-here"
export DEEPGRAM_PROJECT_ID="your-id-here"
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

- All examples use the v5 SDK signature (`new DeepgramClient()`) as documented in the README
- Examples are commented out by default - uncomment the function calls to run them
- Replace placeholder values (YOUR_DEEPGRAM_API_KEY, YOUR_PROJECT_ID, etc.) with actual values
- Some examples require specific file paths or URLs - adjust as needed for your environment

