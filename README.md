# Deepgram JavaScript SDK

An isomorphic JavaScript SDK for [Deepgram](https://www.deepgram.com/).

Documentation: https://developers.deepgram.com/docs/deepgram-sdks

- [Getting an API Key](#getting-an-api-key)
- [Usage](#usage)
  - [Installation](#installation)
    - [UMD](#umd)
    - [ESM](#esm)
    - [Custom `fetch` implementation](#custom-fetch-implementation)
  - [Transcription](#transcription)
    - [Remote Files - Synchronous](#remote-files---synchronous)
    - [Remote Files - Asynchronous](#remote-files---asynchronous)
    - [Local Files - Synchronous](#local-files---synchronous)
    - [Local Files - Asynchronous](#local-files---asynchronous)
- [Development and Contributing](#development-and-contributing)
- [Getting Help](#getting-help)

# Getting an API Key

🔑 To interactive the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

# Usage

## Installation

First of all, you need to install the library:

```sh
# yarn add @deepgram/sdk
# - or -
npm install @deepgram/sdk
```

Then you're able to import the library and configure it.

```js
// const { createClient } from "@deepgram/sdk";
// - or -
import { createClient } from "@deepgram/sdk";

// Create a deepgram client for interacting with the API
const deepgram = createClient("DEEPGRAM_API_KEY");
```

### UMD

You can now use plain `<script>`s to import the Deepgram SDK from CDNs, like:

```html
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
```

or even:

```html
<script src="https://unpkg.com/@deepgram/sdk"></script>
```

Then you can use it from a global `deepgram` variable:

```html
<script>
  const { createClient } = deepgram;
  const _deepgram = createClient("DEEPGRAM_API_KEY");

  console.log("Deepgram instance: ", _deepgram);
  // ...
</script>
```

### ESM

You can now use type="module" `<script>`s to import deepgram from CDNs, like:

```html
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
  const deepgram = createClient("DEEPGRAM_API_KEY");

  console.log("Deepgram instance: ", deepgram);
  // ...
</script>
```

### Custom `fetch` implementation

`@deepgram/sdk` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests, but an alternative `fetch` implementation can be provided as an option. This is most useful in environments where `cross-fetch` is not compatible, for instance Cloudflare Workers:

```js
import { createClient } from "@deepgram/sdk";

// Provide a custom `fetch` implementation as an option
const deepgram = createClient("DEEPGRAM_API_KEY", {
  global: {
    fetch: (...args) => fetch(...args),
  },
});
```

## Transcription

### Remote Files - Synchronous

```js
const { result, error } = await deepgram.listen.syncPrerecordedUrl({ url: URL_OF_FILE }, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

### Remote Files - Asynchronous

```js
const { result, error } = await deepgram.listen.asyncPrerecordedUrl(
  { url: URL_OF_FILE },
  callback,
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

### Local Files - Synchronous

```js
const { result, error } = await deepgram.listen.syncPrerecordedUrl(
  {
    stream: fs.createReadStream("/path/to/file"),
    mimetype: MIMETYPE_OF_FILE,
  },
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

### Local Files - Asynchronous

```js
const { result, error } = await deepgram.listen.syncPrerecordedUrl(
  {
    stream: fs.createReadStream("/path/to/file"),
    mimetype: MIMETYPE_OF_FILE,
  },
  callback,
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

# Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

# Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue in this repository](https://github.com/deepgram/node-sdk/issues/new)
- [Join the Deepgram Github Discussions Community](https://github.com/orgs/deepgram/discussions)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
