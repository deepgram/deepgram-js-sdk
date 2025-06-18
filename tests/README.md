# Test Strategy

This test suite is designed for testing AI APIs with non-deterministic responses using conditional mocking and structure-only snapshots.

## 🎯 Test Types

### E2E Tests (`tests/e2e/`)

- Test complete API workflows with real SDK logic
- Use conditional mocking for reliability
- Structure-only snapshots for non-deterministic AI responses
- Cover both synchronous and asynchronous (callback) methods

### Unit Tests (`tests/unit/`)

- Test individual components and utilities
- Traditional unit testing approach

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
tests/
├── __fixtures__/             # Input data & request objects by product area
│   ├── listen.ts            # Listen/Speech-to-Text fixtures
│   ├── speak.ts             # Speak/Text-to-Speech fixtures
│   ├── read.ts              # Read/Text Analysis fixtures
│   ├── models.ts            # Models API fixtures
│   ├── selfhosted.ts        # Self-hosted API fixtures
│   └── spacewalk.wav        # Test audio file
├── __utils__/               # Shared test utilities
│   ├── serializers.ts       # Structure-only serializer
│   └── mocks.ts            # Conditional mock setup
└── e2e/
    ├── __mocks__/          # Mock API responses by product area
    │   ├── listen.ts        # Listen API mocks
    │   ├── speak.ts         # Speak API mocks
    │   ├── read.ts          # Read API mocks
    │   ├── models.ts        # Models API mocks
    │   ├── auth.ts          # Auth API mocks
    │   └── selfhosted.ts    # Self-hosted API mocks
    └── *.test.ts           # E2E test files
```

## 🧪 Test Coverage

We have comprehensive e2e coverage for all major REST endpoints:

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

**Self-hosted API**:

- `listCredentials()` / `getCredentials()` / `createCredentials()` / `deleteCredentials()`

## 💡 Key Principles

1. **Input data** → `__fixtures__/` (organized by product area)
2. **Mock responses** → `e2e/__mocks__/` (organized by product area)
3. **Test utilities** → `__utils__/` (shared helpers)
4. **Structure over content** → Snapshots test shape, not values
5. **Sync + Async** → Both immediate and callback-based methods covered
