# Changelog: Deepgram JavaScript SDK v5.0.0-alpha.3

This release builds upon v5.0.0-alpha.2 with improvements to authentication, session tracking, browser support, and developer experience.

## ✨ New Features

### Access Token Authentication
- **Added**: Proper support for access token authentication via `accessToken` option
- **Added**: Access tokens now take priority over API keys when provided
- **Added**: Access tokens use Bearer scheme in Authorization header (not Token scheme)
- **Added**: Example demonstrating access token usage (`examples/02-authentication-access-token.js`)
- **Improved**: Access token authentication no longer falls back to API key from environment variables

### Session ID Tracking
- **Added**: Automatic generation of `x-deepgram-session-id` header for all REST requests
- **Added**: Session ID support for WebSocket connections (via headers in Node.js, via protocols in browser)
- **Added**: `sessionId` property on `DeepgramClient` instance to access the generated session ID
- **Added**: Example demonstrating session ID usage (`examples/27-deepgram-session-header.js`)
- **Improved**: Better tracking and debugging capabilities for API requests

### Browser REST API Support
- **Added**: Proxy server script (`scripts/proxy-server.js`) for browser REST API examples
- **Added**: HTTP proxy that forwards requests to Deepgram API with proper CORS headers
- **Added**: Support for `X-Deepgram-Session-Id` header in proxy server
- **Improved**: Browser examples now use proxy server for REST API calls
- **Improved**: Better CORS handling for browser-based REST requests

### Browser Bundle Documentation
- **Added**: Comprehensive documentation for using SDK in browsers via NPM package
- **Added**: Multiple methods for including browser bundle (copy, direct reference, bundler)
- **Updated**: README with browser bundle usage examples

## 🔧 Improvements

### SDK Regeneration
- **Updated**: SDK regenerated with latest Fern definitions
- **Updated**: Type definitions for Agent settings (think provider types)
- **Updated**: Improved type safety for Voice Agent configurations

### Examples & Documentation
- **Updated**: Browser examples now use proxy server for REST API calls
- **Updated**: Access token example now verifies token is actually being used
- **Updated**: All browser examples updated to use new proxy server approach
- **Improved**: Better error handling and verification in examples

### Testing Infrastructure
- **Added**: Script to revert test imports (`scripts/revert-wire-test-imports.js`)
- **Fixed**: Vitest configuration reverted and added to `.fernignore`
- **Improved**: Browser test setup with better global configuration
- **Improved**: Test helpers for browser testing scenarios

### Project Organization
- **Changed**: Changelogs moved to `docs/` directory
- **Added**: `.fernignore` updated to exclude changelog files from regeneration
- **Improved**: Better organization of documentation files

## 🐛 Bug Fixes

### Authentication
- **Fixed**: Access tokens now properly consumed instead of falling back to API keys
- **Fixed**: Bearer token scheme correctly used for access tokens (not Token scheme)

### WebSocket
- **Fixed**: Session ID properly included in WebSocket connections for both Node.js and browser
- **Improved**: Better handling of headers vs protocols for browser WebSocket connections

### Browser Support
- **Fixed**: CORS issues in browser REST API examples
- **Fixed**: Proxy server properly handles OPTIONS preflight requests
- **Improved**: Better header forwarding in proxy server

## 📚 Documentation

### Updated Documentation
- **Updated**: README with browser bundle installation and usage options
- **Updated**: Browser examples documentation
- **Updated**: Access token authentication examples with verification

### New Examples
- **Added**: `examples/27-deepgram-session-header.js` - Demonstrates session ID tracking
- **Updated**: `examples/02-authentication-access-token.js` - Now verifies token usage

## 🔄 Migration Notes

### Access Token Usage

If you're using access tokens, ensure you're passing them correctly:

```javascript
// ✅ Correct: Pass accessToken option
const client = new DeepgramClient({ 
  accessToken: "your-access-token" 
});

// ❌ Incorrect: Don't use apiKey with accessToken
const client = new DeepgramClient({ 
  apiKey: "your-api-key",
  accessToken: "your-access-token" // This will use accessToken, not apiKey
});
```

### Session ID

Session IDs are automatically generated and included in all requests. You can access the session ID:

```javascript
const client = new DeepgramClient({ apiKey: "your-api-key" });
console.log(client.sessionId); // UUID string
```

### Browser REST API

For browser REST API calls, use the proxy server:

```bash
# Start proxy server
DEEPGRAM_API_KEY=your-api-key node scripts/proxy-server.js

# Then configure your client to use the proxy
const client = new DeepgramClient({
  baseUrl: "http://localhost:8001"
});
```

## 📦 Package Details

- **Version**: 5.0.0-alpha.3
- **Node.js**: Requires Node.js >= 18.0.0
- **Dependencies**: 
  - `ws`: ^8.16.0 (for WebSocket support)
- **TypeScript**: ~5.7.2

## 📝 Files Changed

### Added
- `scripts/proxy-server.js` - HTTP proxy server for browser REST API examples
- `scripts/revert-wire-test-imports.js` - Script to revert test imports
- `examples/27-deepgram-session-header.js` - Session ID example
- `examples/browser/27-deepgram-session-header.html` - Browser session ID example
- `docs/CHANGELOG_5.0.0-alpha.3.md` - This changelog

### Modified
- `src/CustomClient.ts` - Added access token support and session ID generation
- `src/BaseClient.ts` - Updated for session ID support
- `examples/02-authentication-access-token.js` - Enhanced with token verification
- `examples/browser/*.html` - Updated to use proxy server
- `tests/browser/*.test.ts` - Updated test setup and helpers
- `tests/browser/global-setup.ts` - Improved browser test configuration
- `tests/browser/helpers.ts` - Enhanced browser test helpers
- `README.md` - Added browser bundle documentation
- `.fernignore` - Added changelog files to ignore list
- `package.json` - Version and dependency updates
- Various auto-generated SDK files (SDK regeneration)

### Removed
- No files removed in this release

## ⚠️ Alpha Release Notes

This is an **alpha release** and may contain breaking changes in future alpha/beta releases. We recommend:
- Testing thoroughly before using in production
- Providing feedback on any issues or improvements needed
- Reviewing the migration guide before upgrading

## 🙏 Acknowledgments

Thank you to all contributors and users who provided feedback during development.

---

For questions or issues, please visit:
- [GitHub Issues](https://github.com/deepgram/deepgram-js-sdk/issues)
- [Deepgram Documentation](https://developers.deepgram.com)
- [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)

