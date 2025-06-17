# Deepgram JS SDK Test Suite

## Overview

This test suite provides comprehensive testing for the Deepgram JS SDK with special consideration for **AI non-determinism**. Since AI transcription APIs produce slightly different results on each call, our tests focus on **structural validation and quality metrics** rather than exact content matching.

## Test Structure

```
tests/
├── unit/           # Unit tests with HTTP mocking
├── integration/    # Integration tests with live API calls
├── e2e/           # End-to-end scenario testing
├── __fixtures__/  # Test data and utilities
│   ├── audio.ts      # Audio sources and expectations
│   ├── requests.ts   # Request configurations
│   ├── responses.ts  # Mock response data
│   └── snapshots.ts  # CI/API-key detection utilities
└── setup.ts       # Global test configuration
```

## Key Features

### 🤖 **AI-Aware Testing**

- **Structural validation** instead of exact content matching
- **Quality metrics** (transcript length, confidence thresholds)
- **Non-deterministic friendly** expectations

### 🔄 **Flexible API Key Handling**

- **With API key**: Live API calls with real validation
- **Without API key**: Representative mock responses for CI
- **Environment detection** automatically chooses the right approach

### 📊 **Test Types**

#### Unit Tests (13 tests)

- HTTP request/response mocking
- Input validation
- Error handling
- SDK structure validation

#### Integration Tests (16 tests)

- Live API calls when `DEEPGRAM_API_KEY` available
- Real transcription validation
- Enhanced features testing (sentiment, intents)
- Concurrent request handling

#### E2E Tests (2 tests)

- End-to-end workflow validation
- Real-world scenario testing

## Running Tests

```bash
# All tests (AI-aware, non-deterministic friendly)
npm test

# Specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# With coverage
npm run test:coverage

# Snapshot commands (for API response capture)
npm run test:snapshots          # Run against existing snapshots (will show AI variations)
npm run test:snapshots:update   # Capture fresh API responses

# CI mode
npm run test:ci
```

## Environment Variables

```bash
# Required for live API testing
DEEPGRAM_API_KEY=your_api_key_here

# Test behavior control
JEST_SNAPSHOT_MODE=auto|record|replay  # Default: auto
UPDATE_SNAPSHOTS=true                 # Force snapshot updates
JEST_SILENT=false                     # Show console output
```

## AI Non-Determinism Handling

### ❌ **What We DON'T Test**

- Exact transcript content
- Precise confidence scores
- Specific word-level timing
- Exact metadata values

### ✅ **What We DO Test**

- Response structure integrity
- Transcript quality (length, type, non-empty)
- Confidence score ranges (> 0.5, ≤ 1.0)
- Error handling patterns
- API contract compliance

### Example Test Pattern

```typescript
// ❌ Brittle (exact matching)
expect(transcript).toBe("exact expected text");

// ✅ Robust (quality validation)
expect(transcript.length).toBeGreaterThan(10);
expect(transcript.trim()).not.toBe("");
expect(confidence).toBeGreaterThan(0.5);
expect(typeof transcript).toBe("string");
```

## CI/CD Integration

The test suite is designed for **zero-configuration CI** usage:

1. **No API keys required** in CI environments
2. **Fast execution** with mock responses
3. **Reliable results** without external API dependencies
4. **Real validation** in development with API keys

## Custom Jest Matchers

```typescript
// Validate complete Deepgram response structure
expect(response).toBeValidTranscriptionResponse();

// Validate transcription quality (AI-aware)
expect(response).toContainAudioTranscription({
  minLength: 10,
  minWordCount: 2,
});
```

## Best Practices

1. **Focus on structure**, not content
2. **Use quality thresholds**, not exact values
3. **Test error conditions** explicitly
4. **Validate API contracts**, not AI decisions
5. **Make tests environment-agnostic**

## Snapshot Testing

Integration tests use snapshots by default (no live API calls):

```bash
# Run integration tests using snapshots (default)
npm run test:snapshots

# Update snapshots with fresh API calls, then test normally
npm run test:snapshots:update
```

**How it works**:

- **Default behavior**: Tests use built-in snapshot data (fast, no API key needed)
- **Update mode**: Makes live API calls → saves response as snapshot → runs test using that snapshot
- **Never compares** live API responses to snapshots (avoids AI non-determinism)

Perfect for CI/CD and development!

This approach ensures reliable, maintainable tests that work regardless of AI model updates or response variations! 🎯
