# Deepgram Node.js SDK

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/deepgram/node-sdk/CI/main) ![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

> This is a pre-release SDK and is very likely to have breaking changes. Feel free to provide
> feedback via GitHub issues and suggest new features.

Official Node.js SDK for [Deepgram](https://www.deepgram.com/)'s automated
speech recognition APIs.

To access the API you will need a Deepgram account. Sign up for free at
[try.deepgram.com][signup].

You can learn more about the full Deepgram API at [https://developers.deepgram.com](https://developers.deepgram.com).

## Installation

### With NPM

```bash
npm install @deepgram/sdk
```

### With Yarn

```bash
yarn add @deepgram/sdk
```

## Constructor

```js
const { Deepgram } = require("@deepgram/sdk");

const deepgram = new Deepgram({
  apiKey: DEEPGRAM_API_KEY,
  apiSecret: DEEPGRAM_API_SECRET,
  apiUrl: CUSTOM_API_URL, // Optionally used for on-prem customers
});
```

## Usage

## Batch Transcription

The `transcribe` method can receive the url to a file or a buffer with a file
to transcribe. Additional options can be provided to customize the result.

```js
const response = await deepgram.transcribe(URL_OR_BUFFER_OF_FILE, {
  punctuate: true,
  // other options are available
});
```

### Options

```js
{
  // AI model used to process submitted audio.
  model?: "general" | "phonecall" |  "meeting" | "<custom-id>",

  // BCP-47 language tag that hints at the primary spoken language.
  // Defaults to en-US
  language?: "en-GB" | "en-IN" | "en-NZ" | "en-US" | "es" | "fr" | "ko" | "pt" | "pt-BR" | "ru" | "tr" | null,

  // Indicates whether to add punctuation and capitalization to the transcript.
  punctuate?: true | false,

  // Indicates whether to remove profanity from the transcript.
  profanity_filter?: true | false,

  // Maximum number of transcript alternatives to return.
  // Defaults to 1
  alternatives?: integer,

  // Indicates whether to redact sensitive information, replacing redacted
  // content with asterisks (*).
  redact?: ["pci", "numbers", "ssn"],

  // Indicates whether to recognize speaker changes.
  diarize?: true | false,

  // Indicates whether to transcribe each audio channel independently.
  multichannel?: true | false,

  // Indicates whether to convert numbers from written format (e.g., one) to
  // numerical format (e.g., 1).
  numerals?: true | false,

  // Terms or phrases to search for in the submitted audio.
  search?: [string],

  // Callback URL to provide if you would like your submitted audio to be
  // processed asynchronously.
  callback?: string,

  // Keywords to which the model should pay particular attention to boosting
  // or suppressing to help it understand context.
  keywords?: [string],

  // Indicates whether Deepgram will segment speech into meaningful semantic
  // units, which allows the model to interact more naturally and effectively
  // with speakers' spontaneous speech patterns.
  utterances?: true | false,

  // Length of time in seconds of silence between words that Deepgram will
  // use when determining where to split utterances. Used when utterances
  // is enabled.
  // Defaults to 0.8 seconds
  utt_split?: number,

  // Mimetype of the source
  // Mimetype is required if the provided source is a buffer
  mimetype?: string,
}
```

### Response

## Key Management

### List Keys

Retrieve all keys using the `keys.list` method.

```js
const response = await deepgram.keys.list();
```

#### Response

```js
{
  keys: [
    {
      key: "API KEY",
      label: "KEY LABEL",
    },
  ];
}
```

### Create Key

Create a new API key using the `keys.create` method with a label for the
key.

```js
const response = await deepgram.keys.create("label for key");
```

#### Response

```js
{
  key: "API KEY",
  secret: "API SECRET",
  label: "LABEL PROVIDED"
}
```

### Delete key

Delete an existing API key using the `keys.delete` method with the key to
delete.

```js
await deepgram.keys.delete("key to delete");
```

## Samples

A sample js file is in the `sample` directory. To run it, update the config
located at the top of the file.

```js
const config = {
  deepgramApiKey: "Your Deepgram API Key",
  deepgramApiSecret: "Your Deepgram API Secret",
  urlToFile: "Url to audio file",
};
```

The sample demonstrates the following uses:

- Transcribing a file from a url
- Creating an API key
- Deleting an API key

## Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue](https://github.com/deepgram/node-sdk/issues/new) on this repository
- Tweet at us! We're [@DeepgramDevs on Twitter](https://twitter.com/DeepgramDevs)

## Further Reading

Check out the Developer Documentation at [https://developers.deepgram.com/](https://developers.deepgram.com/)

[signup]: https://try.deepgram.com?utm_source=node-sdk&utm_content=readme
[license]: LICENSE.txt
