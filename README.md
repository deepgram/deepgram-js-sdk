# Deepgram Node.js SDK

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-square)](CODE_OF_CONDUCT.md)

Node.js official SDK for [Deepgram](https://www.deepgram.com/)'s automated
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
const Deepgram = require("@deepgram/sdk");

const deepgram = new Deepgram({
  apiKey: DEEPGRAM_API_KEY,
  apiSecret: DEEPGRAM_API_SECRET,
  apiUrl: CUSTOM_API_URL,
});
```

## Usage

## Batch Transcription

```js
const response = await deepgram.transcribe(URL_OR_BUFFER_OF_FILE, {
  punctuate: true,
  // other options are available
});
```

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
