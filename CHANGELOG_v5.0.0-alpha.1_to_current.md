# Changelog: Deepgram JavaScript SDK v5.0.0-alpha.1 to v5.0.0-alpha.2

This changelog covers all changes from `v5.0.0-alpha.1` to `v5.0.0-alpha.2`.

## 🚀 Major Changes

### Browser SDK Support
- **Added**: Full browser SDK compilation and support
- **Added**: Browser-compatible WebSocket implementation using custom client
- **Added**: Browser testing infrastructure with comprehensive test suite
- **Changed**: Migrated custom WebSocket logic to dedicated client implementation

### Security Improvements
- **Added**: `.npmrc` configuration for enhanced security
- **Changed**: API keys are no longer stored in memory unnecessarily

## ✨ New Features

### Browser Support
- **Added**: Browser SDK compilation that works without errors in examples
- **Added**: WebSocket support for browser environments
  - Custom WebSocket client implementation
  - Proper protocol handling (using protocol instead of headers for WebSockets)
  - Audio handling fixes for browser WebSocket examples
- **Added**: Browser testing infrastructure
  - Comprehensive browser test suite
  - Test helpers for browser environment
  - Examples can now run in browser context

### Developer Experience
- **Added**: Makefile for running examples (`make run-examples`)
- **Added**: Improved Makefile with better help text and colors
- **Added**: Script to update imports before running wire tests (`tools/update-imports.js`)
- **Added**: Environment variable support for examples
  - Examples now use environment variables
  - CI environment configured to run examples

### Infrastructure
- **Added**: Custom WebSocket client migration
  - Migrated custom WebSocket logic to dedicated client
  - Improved WebSocket connection handling
  - Better separation of concerns

## 🐛 Bug Fixes

### API Fixes
- **Fixed**: Support for keyterms with Flux models in `ListenLiveClient` (#449)
  - Previously, the SDK would throw an error when using keyterms with Flux models
  - Now supports both Nova-3 and Flux streaming models for keyterms
  - Preserves validation behavior for unsupported models (e.g., nova-2)
  - See: https://developers.deepgram.com/docs/keyterm

### Browser Fixes
- **Fixed**: Audio handling in browser WebSocket examples
  - Fixed issue where audio was incorrectly handled as a string
  - Proper audio data handling for browser environments
- **Fixed**: Build order issues
  - Browser build was deleting other builds during compilation
  - Fixed build sequence to prevent conflicts

### Tooling Fixes
- **Fixed**: Makefile issues
  - Fixed broken Makefile commands
  - Updated to use `pnpm exec` for proper command execution
- **Fixed**: CI configuration
  - Fixed CodeQL analysis to ignore examples (not production code)
  - Improved CI permissions handling

## 🔧 Infrastructure & Tooling

### Build System
- **Improved**: Build order handling
- **Improved**: Browser build process
- **Added**: Proper example ignoring in build processes

### CI/CD
- **Updated**: CI to use Makefile for all commands
- **Improved**: CI permissions handling
- **Fixed**: CodeQL analysis configuration
  - Examples are now properly ignored in CodeQL scans
  - Added proper ignore patterns for non-production code

### Development Tools
- **Added**: Makefile improvements
  - Better help text with colors
  - Unified command execution via `pnpm exec`
  - Examples runner (`make run-examples`)
- **Added**: Import update script for wire tests
  - Script to automatically update imports before running wire tests
  - Improves developer workflow

### Configuration
- **Added**: `.npmrc` for security
- **Updated**: `.fernignore` patterns
  - Better ignore patterns for examples
  - Improved Fern configuration

## 📚 Documentation & Examples

### Examples
- **Updated**: Examples now use environment variables
- **Fixed**: Browser WebSocket examples with proper audio handling
- **Added**: Makefile command to run examples easily

### Code Quality
- **Improved**: CodeQL analysis configuration
- **Updated**: Fern ignore patterns for better code generation

## 🔄 SDK Regeneration

Multiple SDK regeneration commits were made during this period:
- Several SDK regenerations by `fern-api[bot]`
- Some regenerations were reverted and reapplied as part of the development process
- Final regeneration included in release

## 📦 Package Details

- **Base Version**: 5.0.0-alpha.1
- **Current Commit**: e83f09a (v5.0.0-alpha.2)
- **Date Range**: December 16-18, 2025

## 📝 Commits Summary

### Features Added
- Browser SDK compilation and examples support
- Browser testing infrastructure
- WebSocket support in browser
- Custom WebSocket client migration
- Makefile improvements
- npmrc for security
- Import update script for wire tests
- Environment variable support for examples
- Security improvement: don't store API keys unnecessarily

### Bug Fixes
- Keyterms support for Flux models in ListenLiveClient
- Audio handling in browser WebSocket examples
- Build order issues
- Makefile command execution
- CI CodeQL configuration

### Chores
- Multiple SDK regenerations
- CI improvements
- Fern ignore pattern updates
- CodeQL analysis fixes

## 🙏 Contributors

- Naomi Carrigan
- Adrian Martinez
- fern-api[bot]

---

For questions or issues, please visit:
- [GitHub Issues](https://github.com/deepgram/deepgram-js-sdk/issues)
- [Deepgram Documentation](https://developers.deepgram.com)
- [API Reference](https://developers.deepgram.com/reference/deepgram-api-overview)

