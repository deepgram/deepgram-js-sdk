# Deepgram Node.js SDK

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/deepgram/node-sdk/CI/main) ![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official Node.js SDK for [Deepgram](https://www.deepgram.com/)'s automated
speech recognition APIs.

To access the API you will need a Deepgram account. Sign up for free at
[signup][signup].

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
  apiUrl: CUSTOM_API_URL, // Optionally used for on-premises customers
});
```

## Usage

## Transcription

The `transcription` property can handle both pre-recorded and live transcriptions.

### Pre-recorded

The `transcription.preRecorded` method handles sending an existing file or
buffer to the Deepgram API to generate a transcription. [Additional options](#options)
can be provided to customize the result.

```js
// Sending a file
const fileSource = { url: URL_OF_FILE };

// Sending a buffer
const bufferSource = { buffer: BUFFER_OF_FILE, mimetype: MIMETYPE_OF_FILE };

// Both fileSource or bufferSource could be provided as the source parameter
const response = await deepgram.transcription.preRecorded(
  fileSource | bufferSource,
  {
    punctuate: true,
    // other options are available
  }
);
```

### Live

The `transcription.live` method provides access to a websocket connection
to the Deepgram API for generating streaming transcriptions. [Additional options](#options)
can be provided to customize the result.

```js
const deepgramLive = deepgram.transcription.live({ punctuate: true });

socket.on("microphone-stream", (stream) => {
  deepgramSocket.send(stream);
});

/**
 * Receive transcriptions based on sent streams
 */
deepgramLive.addListener("transcriptReceived", (transcription) => {
  console.log(transcription.data);
});
```

#### Events

The following events are fired by the live transcription object:

| Event                | Description                                           | Data                                              |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| `open`               | The websocket connection to Deepgram has been opened. | The DG live transcription object                  |
| `close`              | The websocket connection to Deepgram has been closed. | WebSocket.CloseEvent                              |
| `error`              | An error occurred with the websocket connection       | Error object                                      |
| `transcriptReceived` | Deepgram has responded with a transcription           | [Transcription Response](#transcription-response) |

### Transcription Options

Additional transcription options can be provided to both the pre-recorded and
live transcriptions.

```js
{
  // AI model used to process submitted audio.
  model?: "general" | "phonecall" |  "meeting" | "<custom-string>",

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

### Transcription Response

```js
{
  "metadata": {
    "request_id": "string",
    "transaction_key": "string",
    "sha256": "string",
    "created": "string",
    "duration": 0,
    "channels": 0
    },
  "results": {
    "channels": [
      {
        "search": [
          {
            "query": "string",
            "hits": [
              {
                "confidence": 0,
                "start": 0,
                "end": 0,
                "snippet": "string"
              }
            ]
           }
        ],
        "alternatives": [
          {
            "transcript": "string",
            "confidence": 0,
            "words": [
              {
                "word": "string",
                "start": 0,
                "end": 0,
                "confidence": 0
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Project Management

### List Projects

Retrieve all projects

```js
const projects = await deepgram.projects.list();
```

#### List Projects Response

```ts
{
  projects: [
    {
      id: string,
      name: string,
    },
  ],
}
```

### Get a Project

Retrieves all project based on the provided project id.

```js
const project = await deepgram.projects.get(PROJECT_ID);
```

#### Get a Project Response

```ts
{
  id: string,
  name: string,
}
```

### Create Project

Creates a project.

```js
const project = await deepgram.projects.create(NAME_OF_PROJECT);
```

#### Create Project Response

```ts
{
  id: string,
  name: string,
}
```

### Delete Project

Delete a project.

```js
await deepgram.projects.delete(PROJECT_ID);
```

## Key Management

### List Keys

Retrieves all keys for a given project.

```js
const response = await deepgram.keys.list(PROJECT_ID);
```

#### List Keys Response

```ts
{
  keys: [
    {
      id: string,
      comment: string,
      created: Date,
      scopes: Array<string>
    },
  ];
}
```

### Create Key

Create a new API key for a project using the `keys.create` method
with a name for the key.

```js
const response = await deepgram.keys.create(PROJECT_ID, COMMENT_FOR_KEY);
```

#### Create Key Response

```ts
{
  id: string,
  key: string,
  comment: string,
  created: Date,
  scopes: Array<string>
}
```

### Delete key

Delete an existing API key using the `keys.delete` method with the key to
delete.

```js
await deepgram.keys.delete(PROJECT_ID, KEY_ID);
```

## Usage

### Requests by Project

Retrieves transcription requests for a project based on the provided options.

```js
const response = await deepgram.usage.listRequests(PROJECT_ID, {
  limit: 10,
  // other options are available
});
```

#### Requests by Project Options

The options can be provided to both the pre-recorded and
live transcriptions.

```js
{
  // The time to retrieve requests made since
  // Example: "2020-01-01T00:00:00+00:00"
  start?: string,
  // The time to retrieve requests made until
  // Example: "2021-01-01T00:00:00+00:00"
  end?: string,
  // Page of requests to return
  // Defaults to 0
  page?: number,
  // Number of requests to return per page
  // Defaults to 10. Maximum of 100
  limit?: number,
  // Filter by succeeded or failed requests
  // By default, all requests are returned
  status?: 'succeeded' | 'failed'
}
```

#### Requests by Project Response

```ts
{
  page: number,
  limit: number,
  requests?: [
    {
      id: string;
      created: string;
      path: string;
      accessor: string;
      response?:  {
        details: {
          usd: number;
          duration: number;
          total_audio: number;
          channels: number;
          streams: number;
          model: string;
          method: string;
          tags: Array<string>;
          features: Array<string>;
          config: {
            diarize: true;
            multichannel: true;
          };
        }
      }, ||
      {
        message?: string;
      },
      callback?: {
        code: number;
        completed: string;
      },
    },
  ];
}
```

## Samples

A sample js file is in the `sample` directory. To run it, update the config
located at the top of the file.

```js
const config = {
  deepgramApiKey: "YOUR_DEEPGRAM_API_KEY",
  urlToFile:
    "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav",
};
```

The sample demonstrates the following uses:

- Transcribing a prerecorded file
- Retrieving usage for a project
- Creating a project
- Deleting a project
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

[signup]: https://console.deepgram.com?utm_source=node-sdk&utm_content=readme
[license]: LICENSE.txt
