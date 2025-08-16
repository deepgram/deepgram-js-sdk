# Listen v2 Flux-Ready Architecture Example

This example demonstrates the enhanced Listen v2 architecture that's ready for the upcoming flux model and its new events. The architecture provides:

## Features

- **Global Middleware**: Register middleware that applies to all Listen v2 sessions
- **Instance Middleware**: Register middleware specific to individual connections
- **Built-in Plugins**: Automatic turn counting and reconnection with exponential backoff
- **Future-Ready**: Architecture designed to seamlessly support flux model events when available

## Architecture Components

### 1. ListenV2Supervisor

- Automatically attaches to v2 connections
- Manages middleware execution
- Provides built-in plugins (turn counting, reconnection)

### 2. MiddlewareRegistry

- Handles global and instance-specific middleware
- Executes before/after hooks for events
- Provides cleanup on session disposal

### 3. Session Plugins

- Turn counting with speaker detection
- Reconnection with exponential backoff and jitter
- Resume context preservation

## Usage

```javascript
const { createClient, LiveTranscriptionEvents, ListenV2 } = require("@deepgram/sdk");

// Global middleware (applies to all v2 sessions)
ListenV2.use({
  event: "Results",
  before: (payload) => {
    console.log("Processing transcript globally...");
  },
});

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const connection = deepgram.v("v2").listen.live({ model: "nova-3" });

// Instance middleware (applies to this connection only)
connection.use({
  event: "SpeechStarted",
  before: () => console.log("User started speaking"),
});
```

## Flux Model Readiness

When the flux model becomes available, you can:

1. Change the model: `{ model: "flux" }`
2. Add flux-specific middleware:

```javascript
connection.use({
  event: "ConversationTurn",
  before: (data) => {
    console.log(`Turn ${data.turn_id} by ${data.speaker}`);
  },
});

connection.use({
  event: "SentimentAnalysis",
  before: (data) => {
    console.log(`Sentiment: ${data.sentiment} (${data.score})`);
  },
});
```

## Running the Example

1. Set your Deepgram API key:

   ```bash
   export DEEPGRAM_API_KEY="your-api-key-here"
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Enhanced Events

The architecture automatically provides these enhanced events:

- `turn_started` - When a conversation turn begins
- `reconnecting` - When attempting to reconnect
- `reconnected` - When reconnection succeeds
- `middleware_error` - When middleware encounters an error

## Middleware Context

Middleware functions receive a context object with:

```javascript
{
  session, // The live client session
    turnCount, // Current turn count
    connectionAttempt, // Current connection attempt
    metadata, // Last metadata received
    resumeContext; // Resume context for reconnection
}
```
