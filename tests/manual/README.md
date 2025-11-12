# Manual Tests for Deepgram JS SDK

This directory contains manual tests for the Deepgram JavaScript SDK. These tests are simple, standalone Node.js scripts that demonstrate various SDK features and can be used for manual testing and verification.

**Note:** These tests require the locally built SDK from the `dist/cjs/` directory. They test the actual build output, not the npm package.

## Prerequisites

- Node.js 18.0.0 or higher
- A valid Deepgram API key set in the `DEEPGRAM_API_KEY` environment variable

## Setup

1. **Build the SDK first** (required before running any tests):

    ```bash
    yarn build
    ```

2. Set your Deepgram API key:
    ```bash
    export DEEPGRAM_API_KEY=your_api_key_here
    ```

## Running Tests

All tests are simple Node.js scripts that can be run directly:

```bash
node tests/manual/listen/v1/media/transcribe_file/main.js
```

## Test Categories

### Listen API Tests

#### V1 Media - Transcribe File

- `listen/v1/media/transcribe_file/main.js` - Basic file transcription
- `listen/v1/media/transcribe_file/with_auth_token.js` - File transcription with access token
- `listen/v1/media/transcribe_file/with_raw_response.js` - File transcription with raw response

#### V1 Media - Transcribe URL

- `listen/v1/media/transcribe_url/main.js` - Basic URL transcription
- `listen/v1/media/transcribe_url/with_auth_token.js` - URL transcription with access token
- `listen/v1/media/transcribe_url/with_raw_response.js` - URL transcription with raw response

#### V1 WebSocket Connect

- `listen/v1/connect/main.js` - Basic WebSocket connection
- `listen/v1/connect/with_auth_token.js` - WebSocket connection with access token
- `listen/v1/connect/with_raw_response.js` - WebSocket connection (same as main)

#### V2 WebSocket Connect

- `listen/v2/connect/main.js` - Basic V2 WebSocket connection
- `listen/v2/connect/with_auth_token.js` - V2 WebSocket connection with access token
- `listen/v2/connect/with_raw_response.js` - V2 WebSocket connection (same as main)

### Speak API Tests

#### V1 Audio Generate

- `speak/v1/audio/generate/main.js` - Basic text-to-speech
- `speak/v1/audio/generate/with_auth_token.js` - Text-to-speech with access token
- `speak/v1/audio/generate/with_raw_response.js` - Text-to-speech with raw response

#### V1 WebSocket Connect

- `speak/v1/connect/main.js` - Basic Speak WebSocket connection
- `speak/v1/connect/with_auth_token.js` - Speak WebSocket connection with access token
- `speak/v1/connect/with_raw_response.js` - Speak WebSocket connection (same as main)

### Read API Tests

#### V1 Text Analyze

- `read/v1/text/analyze/main.js` - Basic text analysis
- `read/v1/text/analyze/with_auth_token.js` - Text analysis with access token
- `read/v1/text/analyze/with_raw_response.js` - Text analysis with raw response

### Agent API Tests

#### V1 Connect

- `agent/v1/connect/main.js` - Basic Voice Agent connection
- `agent/v1/connect/with_auth_token.js` - Voice Agent connection with access token
- `agent/v1/connect/with_raw_response.js` - Voice Agent connection (same as main)

## Test Patterns

### Basic Tests (`main.js`)

These tests demonstrate the simplest usage of each feature. All tests use async/await since the JavaScript SDK is Promise-based.

### Access Token Tests (`with_auth_token.js`)

These tests demonstrate how to use temporary access tokens instead of API keys. They:

1. Request an access token using an API key
2. Create a new client with the access token
3. Make the API call using the access token

### Raw Response Tests (`with_raw_response.js`)

These tests use the `withRawResponse` API to get the full HTTP response including headers and status codes.

## WebSocket Tests

WebSocket tests include timeout-based cleanup for demonstration purposes:

```javascript
setTimeout(() => {
    connection.close();
}, 3000); // EXAMPLE ONLY: Wait 3 seconds before closing
```

**Note**: In production applications, you should NOT use timeouts like this. Instead:

- Keep the connection alive for as long as needed
- Integrate with your application's event loop
- Close the connection when your application logic determines it's appropriate

## Expected Behavior

All tests should either:

- Complete successfully and print "Request sent" / "Response received" messages
- Fail gracefully and print a caught error message in the format `Caught: <error>`

No test requires user interaction to complete.

## Fixtures

Audio fixture files are located in `fixtures/`:

- `audio.wav` - WAV audio file for testing
- `audio.mp3` - MP3 audio file for testing
