# Deepgram JavaScript SDK Browser Examples

This directory contains browser-compatible examples demonstrating how to use the Deepgram JavaScript SDK in web browsers. These examples are HTML files that can be opened directly in a browser.

## Examples Overview

### Authentication
- **01-authentication-api-key.html** - API key authentication
- **02-authentication-access-token.html** - Access token authentication
- **03-authentication-proxy.html** - Proxy authentication for browser environments

### Transcription
- **04-transcription-prerecorded-url.html** - Transcribe audio from URL
- **05-transcription-prerecorded-file.html** - Transcribe audio from local file
- **06-transcription-prerecorded-callback.html** - Async transcription with callbacks
- **07-transcription-live-websocket.html** - Live transcription via WebSocket
- **08-transcription-captions.html** - Convert transcriptions to WebVTT/SRT captions
- **22-transcription-advanced-options.html** - Advanced transcription options
- **26-transcription-live-websocket-v2.html** - Live transcription via WebSocket V2 API

### Voice Agent
- **09-voice-agent.html** - Voice Agent configuration and usage

### Text-to-Speech
- **10-text-to-speech-single.html** - Single request TTS
- **11-text-to-speech-streaming.html** - Streaming TTS via WebSocket

### Text Intelligence
- **12-text-intelligence.html** - Text analysis using AI features

### Management API
- **13-management-projects.html** - Project management (list, get, update, delete)
- **14-management-keys.html** - API key management (list, get, create, delete)
- **15-management-members.html** - Member management (list, remove, scopes)
- **16-management-invites.html** - Invitation management (list, send, delete)
- **17-management-usage.html** - Usage statistics and request information
- **18-management-billing.html** - Billing and balance information
- **19-management-models.html** - Model information

### On-Premises
- **20-onprem-credentials.html** - On-premises credentials management

### Configuration & Advanced
- **21-configuration-scoped.html** - Scoped configuration examples
- **23-file-upload-types.html** - Different file upload types
- **24-error-handling.html** - Error handling patterns
- **25-binary-response.html** - Binary response handling

## Usage

1. **Build the SDK** (if not already built):
```bash
make build
```

2. **Run the examples** in your browser:

```bash
DEEPGRAM_API_KEY=your_key DEEPGRAM_PROJECT_ID=your_id make browser-serve
```

3. **Navigate to the desired example**:
   - The root view should list all examples as clickable links.

4. **Run the example**:
   - Click the "Run" or action button in each example
   - Results will be displayed in the output area below

## Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

## Browser Compatibility

These examples use ES modules and modern browser APIs. They should work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Features

- **Local Storage**: API keys and project IDs are saved to localStorage for convenience
- **File Upload**: Examples support file uploads using the browser File API
- **WebSocket Support**: Live transcription and streaming TTS examples use WebSocket connections
- **Error Handling**: Examples demonstrate proper error handling patterns
- **Responsive UI**: Examples include basic styling and are mobile-friendly

## Notes

- All examples use the browser build (`deepgram.js`) loaded via `<script>` tag
- The browser build is automatically copied to `examples/browser` when running `make browser-serve`
- Examples access the SDK via the global `deepgram` object (e.g., `const { DeepgramClient } = deepgram;`)
- The SDK is also available as `Deepgram` (uppercase) for consistency with the build output
- File uploads use the browser File API instead of Node.js `fs` module
- WebSocket examples stream audio data in chunks
- API keys are stored in localStorage for convenience but are only accessible locally
- These examples are safe for local development and CI environments

## Differences from Node.js Examples

The browser examples differ from the Node.js examples in several ways:

1. **Import Syntax**: Uses browser build (`<script src="deepgram.js">`) instead of CommonJS (`require`) or ES modules (`import`)
2. **File Handling**: Uses File API and FileReader instead of `fs` module
3. **Environment Variables**: Uses input fields and localStorage instead of `process.env`
4. **Output**: Displays results in the DOM instead of `console.log`
5. **Audio Playback**: Includes audio elements for TTS examples
6. **WebSocket Streaming**: Uses ArrayBuffer and chunked streaming for audio data

## Documentation

For more information, see:
- [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)
- [SDK README](../../README.md)
- [Reference Documentation](../../reference.md)

