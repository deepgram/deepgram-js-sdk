# Test Suites

This directory contains the E2E and unit tests for the Deepgram JS SDK.

## Running Tests

### All Tests

To run the entire test suite:

```bash
pnpm test
```

### E2E Tests

To run only the end-to-end tests:

```bash
pnpm test tests/e2e/
```

### Unit Tests

To run only the unit tests:

```bash
pnpm test tests/unit/
```

### Snapshot Updates

To update snapshots with real API calls:

```bash
# Using Jest's update flag
pnpm test tests/e2e/ -- -u

# or

# By using an environment variable
DEEPGRAM_FORCE_REAL_API=true pnpm test tests/e2e/
```

For more details on the testing strategy, please see the main [project README.md](../README.md).
