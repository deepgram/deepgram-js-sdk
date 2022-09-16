# Deepgram Node.js SDK

[![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official Node.js SDK for [Deepgram](https://www.deepgram.com/)'s automated
speech recognition APIs.

> This SDK only supports hosted usage of api.deepgram.com.

To access the API you will need a Deepgram account. Sign up for free at
[signup][signup].

## Documentation

Full documentation of the Node.js SDK can be found on the
[Deepgram Developer Portal](https://developers.deepgram.com/sdks-tools/sdks/node-sdk/).

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

const deepgram = new Deepgram(DEEPGRAM_API_KEY);
```

## Examples

### Transcribe an Existing File

#### Remote Files

```js
const fileSource = { url: URL_OF_FILE };

const response = await deepgram.transcription.preRecorded(fileSource, {
  punctuate: true,
});
```

#### Local Files

```js
const streamSource = {
  stream: fs.createReadStream("/path/to/file"),
  mimetype: MIMETYPE_OF_FILE,
};

const response = await deepgram.transcription.preRecorded(streamSource, {
  punctuate: true,
});
```

### Transcribe Audio in Real-Time

```js
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm',
  });
  const deepgramSocket = deepgram.transcription.live({ punctuate: true });

  deepgramSocket.addListener('open', () => {
    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0 && deepgramSocket.readyState == 1) {
        deepgramSocket.send(event.data)
      }
    })
    mediaRecorder.start(1000)
  });

  deepgramSocket.addListener("transcriptReceived", (received) => {
    const transcript = received.channel.alternatives[0].transcript;
    if (transcript && received.is_final) {
      console.log(transcript);
    }
  });
});
```

## Samples

To run the sample code, first run the following in your terminal:

```bash
npm install
npm build
```

Then update the config object located at the top of the `index.js`
file in the sample folder.

```js
const config = {
  deepgramApiKey: "YOUR_DEEPGRAM_API_KEY",
  urlToFile:
    "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav",
};
```

Finally, run the sample code using the following command in your terminal:

```bash
node sample/index.js
```

The sample demonstrates the following uses:

- Transcribing a prerecorded file
- Retrieving usage for a project
- Getting a project
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
- Tweet at us! We're [@DeepgramAI on Twitter](https://twitter.com/DeepgramAI)

## Further Reading

Check out the Developer Documentation at [https://developers.deepgram.com/](https://developers.deepgram.com/)

[signup]: https://console.deepgram.com/signup?utm_medium=github&utm_source=DEVREL&utm_content=node-sdk
[license]: LICENSE.txt
