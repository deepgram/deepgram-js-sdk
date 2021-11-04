# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [1.1.0]

### Added

- Prerecorded transcription responses can now be used to generate WebVTT and
  SRT caption files. Example:

  ```js
  const response = await deepgram.transcription.preRecorded(
    { url: "URL_TO_FILE" },
    {
      punctuate: true,
      utterances: true,
    }
  );
  const webVTT = response.toWebVTT();
  const SRT = response.toSRT();
  ```

  The [utterances](https://developers.deepgram.com/documentation/features/utterances/)
  feature is required to use this functionality.

## [1.0.3]

### Added

- In addition to a Url and Buffer, `trascricription.preRecorded` now accepts a
  ReadStream as a source of the file to transcribe.

### Updated

- Removed a console log that occurred when an HTTP request ended

## [1.0.2]

### Added

- `deepgram.projects.update` will now update a project
- Prerecorded transcription responses now include utterances

### Updated

- The project type has been modified to the following:

```ts
{
  project_id: string;
  name?: string;
  company?: string;
};
```

- The key type has been modified to the following:

```ts
{
  api_key_id: string;
  key?: string;
  comment: string;
  created: string;
  scopes: Array<string>;
};
```

- The usage request type has been modified to the following:

```ts
{
  request_id: string;
  created: string;
  path: string;
  accessor: string;
  response?: UsageRequestDetail | UsageRequestMessage;
  callback?: UsageCallback;
};
```

## [1.0.0]

### Added

#### Live transcription

- `deepgram.transcription.live` now manages a websocket connection to Deepgram's API
  for live transcription

#### Projects

- `deepgram.projects` allows listing projects or getting a specific project from
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

[unreleased]: https://github.com/deepgram/node-sdk/compare/1.1.0...HEAD
[1.1.0]: https://github.com/deepgram/node-sdk/compare/1.0.3...1.1.0
[1.0.3]: https://github.com/deepgram/node-sdk/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/deepgram/node-sdk/compare/1.0.0...1.0.2
[1.0.0]: https://github.com/deepgram/node-sdk/compare/0.6.5...1.0.0
[0.6.5]: https://github.com/deepgram/node-sdk/compare/0.6.4...0.6.5
[0.6.4]: https://github.com/deepgram/node-sdk/compare/edc07b4...0.6.4
