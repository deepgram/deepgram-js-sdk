# Changelog for v5.0.0-beta.4

## What's Changed

This beta release focuses on improving test coverage, examples, and configuration flexibility.

### ✨ Enhancements

- **Improved Examples**: All middleware examples converted from JavaScript to TypeScript for better type safety and developer experience
- **Enhanced Testing**: Added comprehensive tests for custom providers, fallback configurations, and base URL priority handling
- **Better Configuration**: Improved base URL handling and configuration priority

### 🧪 Testing Improvements

- Added tests for agent custom providers and fallbacks (`tests/unit/agent-providers.test.ts`)
- Added tests for base URL configuration priority (`tests/unit/baseurl-priority.test.ts`)
- Added tests for custom base URL handling (`tests/unit/custom-baseurl.test.ts`)
- Expanded example coverage for middleware use cases

### 📝 Documentation

- Updated `.fernignore` to protect custom test files
- Improved middleware example documentation
- Converted all middleware examples to TypeScript

### 🔧 Internal Changes

- Multiple SDK regenerations to keep up with API changes
- Improved build and test infrastructure
- Better handling of configuration edge cases

## Full Commit History (since v5.0.0-beta.3)

- f155120 SDK regeneration
- fbd867c chore: update fernignore
- 16cf0fc Revert "feat: add custom middleware package (TODO: ws support, rest works)"
- 0600353 feat: add custom middleware package (TODO: ws support, rest works)
- 98248d8 feat: test custom providers and fallbacks maybe?
- b3df50c chore: sdk regeneration
- 4e7a1fd feat: convert middleware examples to typescript
- 5af2bab test: add tests for baseurl config priority
- e8f05eb chore: sdk regeneration
- 3fdcf28 SDK regeneration

## Installation

```bash
npm install @deepgram/sdk@5.0.0-beta.4
```

## Notes

This is a **beta release** of v5.0.0. Whilst we're confident in the stability, please report any issues you encounter!

- Report issues: https://github.com/deepgram/deepgram-js-sdk/issues
- Documentation: https://developers.deepgram.com/
- Discord: https://discord.gg/deepgram
