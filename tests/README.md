# Test Strategy

This test suite is designed for testing AI APIs with non-deterministic responses using conditional mocking and structure-only snapshots.

## 🎯 Test Types

### E2E Tests (`tests/e2e/`)

- Test complete API workflows with real SDK logic
- Use conditional mocking for reliability
- Structure-only snapshots for non-deterministic AI responses

### Unit Tests (`tests/unit/`)

- Test individual components and utilities
- Traditional unit testing approach

## 🎭 Conditional Mocking

Tests automatically switch between mock and real API calls:

**Normal runs** (default):

```bash
npm test tests/e2e/  # Uses mocks, no API key needed
```

**Snapshot updates**:

```bash
npm test tests/e2e/ -- -u  # Uses real API calls
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
├── __fixtures__/             # Input data & request objects
│   └── e2e-requests.ts      # Shared request fixtures
├── __utils__/               # Shared test utilities
│   ├── serializers.ts       # Structure-only serializer
│   └── mocks.ts            # Conditional mock setup
└── e2e/
    ├── __mocks__/          # Mock API responses
    └── *.test.ts           # E2E test files
```

## 💡 Key Principles

1. **Input data** → `__fixtures__/` (shared across tests)
2. **Mock responses** → `e2e/__mocks__/` (test-specific)
3. **Test utilities** → `__utils__/` (shared helpers)
4. **Structure over content** → Snapshots test shape, not values
