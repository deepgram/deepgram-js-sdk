# Changelog: Deepgram JavaScript SDK v5.0.0-beta.3

This release builds upon v5.0.0-beta.2 with WebSocket improvements, a new connection alias, and enhanced test coverage.

## ✨ New Features

### `createConnection()` Alias for WebSocket Connections
- **Added**: `createConnection()` method as an alias for `connect()` on all WebSocket clients
- **Why**: The `connect()` method name was confusing since WebSocket objects also have a `connect()` method that must be called separately
- **Usage**: Both methods are equivalent; use whichever is clearer for your codebase:

```typescript
// Both are equivalent:
const socket = await client.listen.v1.connect({ model: "nova-3" });
const socket = await client.listen.v1.createConnection({ model: "nova-3" });
```

- **Available on**:
  - `client.listen.v1.createConnection()`
  - `client.listen.v2.createConnection()`
  - `client.speak.v1.createConnection()`
  - `client.agent.v1.createConnection()`

### Multiple Keyterms Support in Listen V2
- **Added**: Support for passing multiple keyterms as an array in `listen.v2.connect()` / `listen.v2.createConnection()`
- **Previously**: Only a single keyterm string was supported
- **Now**: Pass an array of strings for multiple boosted terms:

```typescript
const socket = await client.listen.v2.connect({
  model: "nova-3",
  keyterm: ["deepgram", "transcription", "speech-to-text"]
});
```

## 🔧 Improvements

### WebSocket Listener Management
- **Fixed**: Duplicate event listeners no longer accumulate on WebSocket connections
- **Added**: `_resetConnectionState()` helper methods to clean up listeners on reconnection
- **Improved**: Better memory management and event handling for long-running WebSocket connections

### SDK Regeneration
- **Updated**: SDK regenerated with latest Fern definitions

## 🧪 Testing

### New Test Coverage
- **Added**: Comprehensive test coverage for WebSocket connections and binary message handling
- **Added**: Tests for `createConnection()` alias methods
- **Added**: Tests for multiple keyterms support in listen.v2
- **Added**: Unit tests for error handling and error classes
- **Added**: Unit tests for authentication utilities (BasicAuth, BearerToken)
- **Added**: Wire tests for REST-based transcription endpoints
- **Added**: Tests verifying async-send-finalize patterns
- **Added**: Tests for Node.js version compatibility

### Test Infrastructure
- **Updated**: `.fernignore` to preserve custom test files during SDK regeneration

## 📚 Documentation

### Migration Guide Updates
- **Updated**: Added documentation for `createConnection()` alias
- **Updated**: Added documentation for multiple keyterms in V2
- **Updated**: Migration checklist updated to mention `createConnection()` option

## 🐛 Bug Fixes

### WebSocket
- **Fixed**: Event listeners properly cleaned up on connection reset/reconnection
- **Fixed**: Prevented accumulation of duplicate listeners over time

## 📦 Package Details

- **Version**: 5.0.0-beta.3
- **Node.js**: Requires Node.js >= 18.0.0
- **Dependencies**:
  - `ws`: ^8.16.0 (for WebSocket support)
- **TypeScript**: ~5.7.2

## 📝 Files Changed

### Added
- `tests/unit/async-send-finalize.test.ts` - Tests for async send/finalize patterns
- `tests/unit/nodejs-version-compatibility.test.ts` - Node.js compatibility tests
- `tests/unit/auth/BasicAuth.test.ts` - BasicAuth utility tests
- `tests/unit/auth/BearerToken.test.ts` - BearerToken utility tests
- `tests/unit/error-handling.test.ts` - Error classes and handling tests
- `tests/wire/listen/v1/transcription.test.ts` - REST transcription wire tests
- `tests/wire/auth/v1/tokens.test.ts` - Auth token wire tests
- `docs/CHANGELOG_5.0.0-beta.3.md` - This changelog

### Modified
- `src/CustomClient.ts` - Added `createConnection()` aliases and listener cleanup
- `docs/MIGRATION_GUIDE_V4_TO_V5.md` - Added `createConnection()` and keyterms documentation
- `.fernignore` - Added new test files to preserve during regeneration

## 🔄 Migration Notes

### Using `createConnection()` (Optional)

If you find `connect()` confusing (since you still need to call `socket.connect()` after), you can use `createConnection()` instead:

```typescript
// Before (still works)
const socket = await client.listen.v1.connect({ model: "nova-3" });
socket.connect();
await socket.waitForOpen();

// Now also available
const socket = await client.listen.v1.createConnection({ model: "nova-3" });
socket.connect();
await socket.waitForOpen();
```

### Multiple Keyterms in V2

If you were working around single keyterm limitation, you can now pass arrays:

```typescript
// Before (single keyterm only)
const socket = await client.listen.v2.connect({
  keyterm: "deepgram"
});

// Now (multiple keyterms supported)
const socket = await client.listen.v2.connect({
  keyterm: ["deepgram", "transcription", "speech"]
});
```

## ⚠️ Beta Release Notes

This is a **beta release**. While the API is stabilizing, minor adjustments may still occur before the final v5.0.0 release. We recommend:
- Testing thoroughly before using in production
- Providing feedback on any issues or improvements needed
- Reviewing the migration guide before upgrading from v4

## 🙏 Acknowledgments

Thank you to all contributors and users who provided feedback during development.

---

For questions or issues, please visit:
- [GitHub Issues](https://github.com/deepgram/deepgram-js-sdk/issues)
- [Deepgram Documentation](https://developers.deepgram.com)
- [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)
