# Browser Example Tests

This directory contains automated tests for the browser examples in `examples/browser/`.

## Setup

1. **Install dependencies** (including Playwright browsers):
```bash
pnpm install
npx playwright install chromium
```

2. **Set environment variables**:
```bash
export DEEPGRAM_API_KEY="your-api-key-here"
export DEEPGRAM_PROJECT_ID="your-project-id-here"  # Optional, for management API examples
```

## Running Tests

### Run all browser tests:
```bash
pnpm test:browser
```

### Run specific test file:
```bash
pnpm test:browser examples.test.ts
```

### Run with UI (for debugging):
```bash
pnpm test:browser --ui
```

### Run via Makefile:
```bash
make test:browser
```

## Test Structure

- **`setup.ts`**: Test setup and helper functions for environment variables
- **`helpers.ts`**: Utility functions for interacting with browser pages
- **`examples.test.ts`**: Comprehensive test that checks all HTML examples
- **`01-authentication-api-key.test.ts`**: Specific test for authentication example
- **`04-transcription-prerecorded-url.test.ts`**: Specific test for transcription example

## What Gets Tested

The tests verify that:

1. **Page Loading**: Each HTML example loads without errors
2. **Required Elements**: Examples have required UI elements (API key input, buttons, output area)
3. **Basic Functionality**: Examples can execute basic operations (for non-complex examples)

### Excluded from Interactive Testing

Some examples are excluded from full interactive testing due to complexity:
- File upload examples (require actual file selection)
- WebSocket examples (require long-running connections)
- Streaming examples (require continuous data flow)
- Voice agent examples (require complex setup)

These examples are still tested for:
- Page loading
- Element presence
- Basic structure

## CI Integration

Browser tests can be added to CI workflows. Make sure to:

1. Install Playwright browsers in CI:
```yaml
- name: Install Playwright browsers
  run: npx playwright install chromium --with-deps
```

2. Set environment variables (as secrets):
```yaml
env:
  DEEPGRAM_API_KEY: ${{ secrets.DEEPGRAM_API_KEY }}
  DEEPGRAM_PROJECT_ID: ${{ secrets.DEEPGRAM_PROJECT_ID }}
```

3. Run tests:
```yaml
- name: Run browser tests
  run: pnpm test:browser
```

## Troubleshooting

### Tests fail with "Browser not found"
Run `npx playwright install chromium` to install the browser.

### Tests timeout
Some examples make real API calls which may timeout. Increase timeout in test files if needed.

### API key errors
Ensure `DEEPGRAM_API_KEY` environment variable is set correctly.

### Module import errors
Make sure the SDK is built (`pnpm build`) before running browser tests, as they load the ESM build.

