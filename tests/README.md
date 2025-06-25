# Test Strategy

This test suite is designed for testing AI APIs with both deterministic and non-deterministic responses using conditional mocking, structure-only snapshots, and comprehensive WebSocket testing.

## 🎯 Test Types

### E2E Tests (`tests/e2e/`) - 44 test suites

Test complete API workflows with real SDK logic covering:

- **REST APIs**: Complete workflows for all major endpoints
- **WebSocket Live Clients**: Real-time connection testing with mock WebSocket infrastructure
- Use conditional mocking for reliability
- Structure-only snapshots for non-deterministic AI responses
- Cover both synchronous and asynchronous (callback) methods

### Unit Tests (`tests/unit/`) - 9 test suites

Test individual components and utilities:

- **Live Client Internals**: Message handling, connection state management
- **Utility Functions**: String, object, URL manipulation, type guards
- **Core Infrastructure**: Fetch utilities, constants, transformations
- Traditional unit testing approach with focused isolation

## 🌐 WebSocket Live Client Testing

Comprehensive testing infrastructure for real-time WebSocket connections:

### Mock WebSocket Infrastructure (`tests/__utils__/websocket-mocks.ts`)

- **MockWebSocket**: Simulates real WebSocket behavior with event handling
- **WebSocketScenario**: Orchestrates complete workflow simulations
- **Mock Data**: Realistic response data for all live client types
- **Event Simulation**: Connection, message, error, and close events

### Live Client Coverage

**ListenLiveClient** (Live Transcription):

- Connection lifecycle and state management
- Real-time audio streaming workflows
- Event handling: Open, Close, Error, Transcript, Metadata, UtteranceEnd, SpeechStarted
- KeepAlive mechanism and connection recovery

**SpeakLiveClient** (Live Text-to-Speech):

- TTS synthesis workflow simulation
- Streaming text-to-speech sessions
- Event handling: Open, Close, Error, Metadata, Flushed, Warning, Audio
- Multiple TTS operations (text → flush → clear → close)

**AgentLiveClient** (Conversational AI):

- Complete agent conversation workflows
- Function call interaction patterns
- Bidirectional audio communication
- Event handling: Welcome, ConversationText, AgentThinking, FunctionCallRequest, etc.

## 🎭 Conditional Mocking

Tests automatically switch between mock and real API calls:

**Normal runs** (default):

```bash
npm test tests/e2e/  # Uses mocks, no API key needed
```

**Snapshot updates** (uses real API calls):

```bash
# Using Jest's update flag
npm test tests/e2e/ -- -u

# Using environment variable
DEEPGRAM_FORCE_REAL_API=true npm test tests/e2e/

# Update specific test snapshots
npm test tests/e2e/listen-transcribe-url.test.ts -- -u
```

## 📸 Structure-Only Snapshots

Since AI responses are non-deterministic, snapshots capture structure, not content:

```typescript
// Actual API response values become type placeholders:
{
  "transcript": "<string>",     // Instead of actual text
  "confidence": "<number>",     // Instead of 0.9234
  "duration": "<number>"        // Instead of 25.933
}
```

## 📁 Organization

```
tests/                          # 53 test suites, 213 tests total
├── __fixtures__/              # Input data & request objects by product area
│   ├── listen.ts             # Listen/Speech-to-Text fixtures
│   ├── speak.ts              # Speak/Text-to-Speech fixtures
│   ├── read.ts               # Read/Text Analysis fixtures
│   ├── models.ts             # Models API fixtures
│   ├── selfhosted.ts         # Self-hosted API fixtures
│   └── spacewalk.wav         # Test audio file
├── __utils__/                # Shared test utilities
│   ├── serializers.ts        # Structure-only serializer
│   ├── mocks.ts             # Conditional mock setup for REST APIs
│   ├── websocket-mocks.ts   # WebSocket mock infrastructure
│   └── index.ts             # Utility exports
├── e2e/                      # 44 end-to-end test suites
│   ├── __mocks__/           # Mock API responses by product area
│   │   ├── listen.ts         # Listen API mocks
│   │   ├── speak.ts          # Speak API mocks
│   │   ├── read.ts           # Read API mocks
│   │   ├── models.ts         # Models API mocks
│   │   ├── auth.ts           # Auth API mocks
│   │   └── selfhosted.ts     # Self-hosted API mocks
│   ├── *-live-connection.test.ts    # WebSocket live client tests
│   └── *.test.ts            # REST API test files
└── unit/                     # 9 unit test suites
    ├── live-client-*.test.ts        # Live client unit tests
    └── *.test.ts            # Utility and component unit tests
```

## 🧪 Test Coverage

### REST API Coverage (E2E)

**Listen API** (Speech-to-Text):

- `transcribeUrl()` / `transcribeUrlCallback()` - Sync/async URL transcription
- `transcribeFile()` / `transcribeFileCallback()` - Sync/async file transcription

**Speak API** (Text-to-Speech):

- `request()` - TTS synthesis

**Read API** (Text Analysis):

- `analyzeText()` / `analyzeTextCallback()` - Sync/async text analysis
- `analyzeUrl()` / `analyzeUrlCallback()` - Sync/async URL analysis

**Models API**:

- `getAll()` - List all models
- `getModel()` - Get specific model

**Auth API**:

- `grantToken()` - Generate temporary tokens

**Manage API** (Complete project management):

- Project operations: create, read, update, delete, leave
- Member management: get members, update scopes, remove members
- Key management: create, read, delete project keys
- Usage tracking: summaries, requests, fields, balances
- Invitations: send, get, delete project invites

**Self-hosted API**:

- `listCredentials()` / `getCredentials()` / `createCredentials()` / `deleteCredentials()`

### Live WebSocket Coverage (E2E + Unit)

**Connection Management** (Unit Tests):

- WebSocket connection lifecycle (connecting → open → closing → closed)
- Message buffering and send behavior validation
- Client-specific methods (keepAlive, sendText, flush, etc.)
- Error handling and input validation

**Message & Event Handling** (Unit Tests):

- Message parsing for all client types (ListenLiveClient, SpeakLiveClient, AgentLiveClient)
- Event emission testing for different message types
- Binary data handling (audio, blobs, ArrayBuffers)
- Error handling for malformed JSON and unknown message types

**Real-time Workflows** (E2E Tests):

- **Listen**: Full transcription workflows, audio streaming, connection recovery
- **Speak**: Complete TTS synthesis, streaming sessions, multi-operation flows
- **Agent**: Conversation workflows, function calls, bidirectional communication

## 💡 Key Principles

1. **Input data** → `__fixtures__/` (organized by product area)
2. **Mock responses** → `e2e/__mocks__/` (organized by product area)
3. **Test utilities** → `__utils__/` (shared helpers for REST + WebSocket)
4. **Structure over content** → Snapshots test shape, not values
5. **Sync + Async** → Both immediate and callback-based methods covered
6. **Real-time ready** → WebSocket clients tested with realistic workflows
7. **Deterministic testing** → Mock infrastructure ensures reliable CI/CD
8. **Comprehensive coverage** → 213 tests across 53 suites covering all SDK functionality
