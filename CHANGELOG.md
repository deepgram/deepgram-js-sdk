# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Live transcription

- `deepgram.transcription.live` now manages a websocket connection to Deepgram's API
  for live transcription

#### Projects

- `deepgram.projects` allows listing, getting, creating and deleting of projects in
  your Deepgram account

### Updated

#### Pre-recorded transcription

- `deepgram.batch` has been moved to `deepgram.transcription.preRecorded`
- Type of `source` parameter of pre-recorded transcriptions has changed. You can now
  send one of two types of objects: `{ url: YOUR_FILES_URL }` or
  `{ buffer: BUFFER_OF_YOUR_FILE, mimetype: FILES_MIME_TYPE }`

#### API Key management

- All `deepgram.keys` methods now require a `projectId`.
- `deepgram.keys.create` now requires an additional parameter `scopes`. This is a
  string array specifying the scopes available to the newly created API key

## [0.6.5]

- Added notice to README to denote the library is in a very unstable state.

## [0.6.4]

### Added

- `transcribe` method will now return transcription results for both urls or buffers.
- `keys` now provides `create`, `list`, and `delete` methods that allow managing of
  API keys.

---

[unreleased]: https://github.com/vonage/vscode/compare/0.6.5...HEAD
[0.6.5]: https://github.com/vonage/vscode/compare/0.6.4...0.6.5
[0.6.4]: https://github.com/vonage/vscode/compare/edc07b4...0.6.4
