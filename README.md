# Deepgram Node.js SDK

[![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official Node.js SDK for [Deepgram](https://www.deepgram.com/)'s automated
speech recognition APIs.

> This SDK only supports hosted usage of api.deepgram.com.

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

const deepgram = new Deepgram(DEEPGRAM_API_KEY);
```

## Usage

## Transcription

The `transcription` property can handle both pre-recorded and live transcriptions.

### Prerecorded Transcription

The `transcription.preRecorded` method handles sending an existing file or
buffer to the Deepgram API to generate a transcription. [Additional options](#prerecorded-transcription-options)
can be provided to customize the result.

```js
// Sending a file
const fileSource = { url: URL_OF_FILE };

// Sending a buffer
const bufferSource = { buffer: BUFFER_OF_FILE, mimetype: MIMETYPE_OF_FILE };

// Sending a ReadStream
const streamSource = {
  stream: fs.createReadStream("/path/to/file"),
  mimetype: MIMETYPE_OF_FILE,
};

// Both fileSource or bufferSource could be provided as the source parameter
const response = await deepgram.transcription.preRecorded(
  fileSource | bufferSource | streamSource,
  {
    punctuate: true,
    // other options are available
  }
);
```

#### Prerecorded Transcription Options

Additional transcription options can be provided for prerecorded transcriptions.

```js
{
  /**
   * AI model used to process submitted audio.
   * @default general
   * @remarks Possible values are general, phonecall, meeting or a custom string
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/model
   */
  model?: Models | string;

  /**
   * Version of the model to use.
   * @default latest
   * @remarks latest OR <version_id>
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/version
   */
  version: string;
  /**
   * BCP-47 language tag that hints at the primary spoken language.
   * @default en-US
   * @remarks Possible values are en-GB, en-IN, en-NZ, en-US, es, fr, ko, pt,
   * pt-BR, ru, tr or null
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/language
   */
  language?: string;
  /**
   * Indicates whether to add punctuation and capitalization to the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/punctuate
   */
  punctuate?: boolean;
  /**
   * Indicates whether to remove profanity from the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/profanity_filter
   */
  profanity_filter?: boolean;
  /**
   * Indicates whether to redact sensitive information, replacing redacted content with asterisks (*).
   * @remarks Options include:
   *  `pci`: Redacts sensitive credit card information, including credit card number, expiration date, and CVV
   *  `numbers` (or `true)`: Aggressively redacts strings of numerals
   *  `ssn` (*beta*): Redacts social security numbers
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/redact
   */
  redact?: Array<string>;
  /**
   * Indicates whether to recognize speaker changes. When set to true, each word
   * in the transcript will be assigned a speaker number starting at 0.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/diarize
   */
  diarize?: boolean;
  /**
   * Indicates whether to transcribe each audio channel independently. When set
   * to true, you will receive one transcript for each channel, which means you
   * can apply a different model to each channel using the model parameter (e.g.,
   * set model to general:phonecall, which applies the general model to channel
   * 0 and the phonecall model to channel 1).
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/multichannel
   */
  multichannel?: boolean;
  /**
   * Maximum number of transcript alternatives to return. Just like a human listener,
   * Deepgram can provide multiple possible interpretations of what it hears.
   * @default 1
   */
  alternatives?: number;
  /**
   * Indicates whether to convert numbers from written format (e.g., one) to
   * numerical format (e.g., 1). Deepgram can format numbers up to 999,999.
   * @remarks Converted numbers do not include punctuation. For example,
   * 999,999 would be transcribed as 999999.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/numerals
   */
  numerals?: boolean;
  /**
   * Terms or phrases to search for in the submitted audio. Deepgram searches
   * for acoustic patterns in audio rather than text patterns in transcripts
   * because we have noticed that acoustic pattern matching is more performant.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/search
   */
  search?: Array<string>;
  /**
   * Callback URL to provide if you would like your submitted audio to be
   * processed asynchronously. When passed, Deepgram will immediately respond
   * with a request_id. When it has finished analyzing the audio, it will send
   * a POST request to the provided URL with an appropriate HTTP status code.
   * @remarks You may embed basic authentication credentials in the callback URL.
   * Only ports 80, 443, 8080, and 8443 can be used for callbacks.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/callback
   */
  callback?: string;
  /**
   * Keywords to which the model should pay particular attention to boosting
   * or suppressing to help it understand context. Just like a human listener,
   * Deepgram can better understand mumbled, distorted, or otherwise
   * hard-to-decipher speech when it knows the context of the conversation.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/keywords
   */
  keywords?: Array<string>;
  /**
   * Indicates whether Deepgram will segment speech into meaningful semantic
   * units, which allows the model to interact more naturally and effectively
   * with speakers' spontaneous speech patterns. For example, when humans
   * speak to each other conversationally, they often pause mid-sentence to
   * reformulate their thoughts, or stop and restart a badly-worded sentence.
   * When utterances is set to true, these utterances are identified and
   * returned in the transcript results.
   *
   * By default, when utterances is enabled, it starts a new utterance after
   * 0.8 s of silence. You can customize the length of time used to determine
   * where to split utterances by submitting the utt_split parameter.
   * @remarks **BETA FEATURE**
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/utterances
   */
  utterances?: boolean;
  /**
   * Length of time in seconds of silence between words that Deepgram will
   * use when determining where to split utterances. Used when utterances
   * is enabled.
   * @default 0.8 seconds
   * @remarks **BETA FEATURE**
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/utt_split
   */
  utt_split?: number;
}
```

#### Prerecorded Transcription Response

```ts
{
  request_id?: string;
  metadata?: {
    request_id: string;
    transaction_key: string;
    sha256: string;
    created: string;
    duration: number;
    channels: number;
  };
  results?: {
    channels: Array<{
      search?: Array<{
        query: string;
        hits: Array<{
          confidence: number;
          start: number;
          end: number;
          snippet: string;
        }>;
      }>;
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
          punctuated_word?: string;
        }>;
      }>;
    }>;
    utterances?: Array<{
      start: number;
      end: number;
      confidence: number;
      channel: number;
      transcript: string;
      words: Array<{
        word: string;
        start: number;
        end: number;
        confidence: number;
        punctuated_word?: string;
      }>;
      speaker?: number;
      id: string;
    }>;
  };
};
```

### Live Transcription

The `transcription.live` method provides access to a websocket connection
to the Deepgram API for generating streaming transcriptions. [Additional options](#live-transcription-options)
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

#### Live Transcription Options

Additional transcription options can be provided for live transcriptions.

```js
{
  /**
   * AI model used to process submitted audio.
   * @default general
   * @remarks Possible values are general, phonecall, meeting or a custom string
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/model
   */
  model?: Models | string;

  /**
   * Version of the model to use.
   * @default latest
   * @remarks latest OR <version_id>
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/version
   */
  version: string;
  /**
   * BCP-47 language tag that hints at the primary spoken language.
   * @default en-US
   * @remarks Possible values are en-GB, en-IN, en-NZ, en-US, es, fr, ko, pt,
   * pt-BR, ru, tr or null
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/language
   */
  language?: string;
  /**
   * Indicates whether to add punctuation and capitalization to the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/punctuate
   */
  punctuate?: boolean;
  /**
   * Indicates whether to remove profanity from the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/profanity_filter
   */
  profanity_filter?: boolean;
  /**
   * Indicates whether to redact sensitive information, replacing redacted content with asterisks (*).
   * @remarks Options include:
   *  `pci`: Redacts sensitive credit card information, including credit card number, expiration date, and CVV
   *  `numbers` (or `true)`: Aggressively redacts strings of numerals
   *  `ssn` (*beta*): Redacts social security numbers
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/redact
   */
  redact?: Array<string>;
  /**
   * Indicates whether to recognize speaker changes. When set to true, each word
   * in the transcript will be assigned a speaker number starting at 0.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/diarize
   */
  diarize?: boolean;
  /**
   * Indicates whether to transcribe each audio channel independently. When set
   * to true, you will receive one transcript for each channel, which means you
   * can apply a different model to each channel using the model parameter (e.g.,
   * set model to general:phonecall, which applies the general model to channel
   * 0 and the phonecall model to channel 1).
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/multichannel
   */
  multichannel?: boolean;
  /**
   * Maximum number of transcript alternatives to return. Just like a human listener,
   * Deepgram can provide multiple possible interpretations of what it hears.
   * @default 1
   */
  alternatives?: number;
  /**
   * Indicates whether to convert numbers from written format (e.g., one) to
   * numerical format (e.g., 1). Deepgram can format numbers up to 999,999.
   * @remarks Converted numbers do not include punctuation. For example,
   * 999,999 would be transcribed as 999999.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/numerals
   */
  numerals?: boolean;
  /**
   * Terms or phrases to search for in the submitted audio. Deepgram searches
   * for acoustic patterns in audio rather than text patterns in transcripts
   * because we have noticed that acoustic pattern matching is more performant.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/search
   */
  search?: Array<string>;
  /**
   * Callback URL to provide if you would like your submitted audio to be
   * processed asynchronously. When passed, Deepgram will immediately respond
   * with a request_id. When it has finished analyzing the audio, it will send
   * a POST request to the provided URL with an appropriate HTTP status code.
   * @remarks You may embed basic authentication credentials in the callback URL.
   * Only ports 80, 443, 8080, and 8443 can be used for callbacks.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/callback
   */
  callback?: string;
  /**
   * Keywords to which the model should pay particular attention to boosting
   * or suppressing to help it understand context. Just like a human listener,
   * Deepgram can better understand mumbled, distorted, or otherwise
   * hard-to-decipher speech when it knows the context of the conversation.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/keywords
   */
  keywords?: Array<string>;
  /**
   * Indicates whether the streaming endpoint should send you updates to its
   * transcription as more audio becomes available. By default, the streaming
   * endpoint returns regular updates, which means transcription results will
   * likely change for a period of time. You can avoid receiving these updates
   * by setting this flag to false.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/interim_results
   */
  interim_results?: boolean;
  /**
   * Indicates whether Deepgram will detect whether a speaker has finished
   * speaking (or paused for a significant period of time, indicating the
   * completion of an idea). When Deepgram detects an endpoint, it assumes
   * that no additional data will improve its prediction, so it immediately
   * finalizes the result for the processed time range and returns the
   * transcript with a speech_final parameter set to true.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/endpointing
   */
  endpointing?: boolean;
  /**
   * Length of time in milliseconds of silence that voice activation detection
   * (VAD) will use to detect that a speaker has finished speaking. Used when
   * endpointing is enabled. Defaults to 10 ms. Deepgram customers may configure
   * a value between 10 ms and 500 ms; on-premise customers may remove this
   * restriction.
   * @default 10
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/vad_turnoff
   */
  vad_turnoff?: number;
  /**
   * Expected encoding of the submitted streaming audio.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/encoding
   */
  encoding?: string;
  /**
   * Number of independent audio channels contained in submitted streaming
   * audio. Only read when a value is provided for encoding.
   * @default 1
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/channels
   */
  channels?: number;
  /**
   * Sample rate of submitted streaming audio. Required (and only read)
   * when a value is provided for encoding.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeStreamingAudio/properties/sample_rate
   */
  sample_rate?: number;
}
```

#### Live Transcription Response

```ts
{
  channel_index: Array<number>;
  duration: number;
  start: number;
  is_final: boolean;
  speech_final: boolean;
  channel: {
    search?: Array<{
      query: string;
      hits: Array<{
        confidence: number;
        start: number;
        end: number;
        snippet: string;
      }>
    }>,
    alternatives: Array<{
      transcript: string;
      confidence: number;
      words: Array<{
        word: string;
        start: number;
        end: number;
        confidence: number;
        punctuated_word?: string;
      }>
    }>
  }
};
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

### Update a Project

Updates a project based on a provided project object. This object must contain
`project_id` and `name` properties.

```js
const updateResponse = await deepgram.projects.update(project);
```

#### Update a Project Response

```ts
{
  message: string;
}
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
  api_keys: [
    {
      api_key_id: string,
      comment: string,
      created: string,
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
  api_key_id: string,
  key: string,
  comment: string,
  created: string,
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
      request_id: string;
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
            multichannel?: boolean;
            interim_results?: boolean;
            punctuate?: boolean;
            ner?: boolean;
            utterances?: boolean;
            replace?: boolean;
            profanity_filter?: boolean;
            keywords?: boolean;
            sentiment?: boolean;
            diarize?: boolean;
            detect_language?: boolean;
            search?: boolean;
            redact?: boolean;
            alternatives?: boolean;
            numerals?: boolean;
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

### Get Specific Request

Retrieves a specific transcription request for a project based on the provided
`projectId` and `requestId`.

```js
const response = await deepgram.usage.getRequest(PROJECT_ID, REQUEST_ID);
```

#### Specific Request Response

```ts
{
  request_id: string;
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
        multichannel?: boolean;
        interim_results?: boolean;
        punctuate?: boolean;
        ner?: boolean;
        utterances?: boolean;
        replace?: boolean;
        profanity_filter?: boolean;
        keywords?: boolean;
        sentiment?: boolean;
        diarize?: boolean;
        detect_language?: boolean;
        search?: boolean;
        redact?: boolean;
        alternatives?: boolean;
        numerals?: boolean;
      };
    }
  }, ||
  {
    message?: string;
  },
  callback?: {
    code: number;
    completed: string;
  }
}
```

### Get Usage by Project

Retrieves aggregated usage data for a project based on the provided options.

```js
const response = await deepgram.usage.getUsage(PROJECT_ID, {
  start: "2020-01-01T00:00:00+00:00",
  // other options are available
});
```

#### Usage by Project Options

```js
{
  // The time to retrieve requests made since
  // Example: "2020-01-01T00:00:00+00:00"
  start?: string,
  // The time to retrieve requests made until
  // Example: "2021-01-01T00:00:00+00:00"
  end?: string,
  // Specific identifer for a request
  accessor?: string,
  // Array of tags used in requests
  tag?: Array<string>,
  // Filter requests by method
  method?: "sync" | "async" | "streaming",
  // Filter requests by model used
  model?: string,
  // Filter only requests using multichannel feature
  multichannel?: boolean,
  // Filter only requests using interim results feature
  interim_results?: boolean,
  // Filter only requests using the punctuation feature
  punctuate?: boolean,
  // Filter only requests using ner feature
  ner?: boolean,
  // Filter only requests using utterances feature
  utterances?: boolean,
  // Filter only requests using replace feature
  replace?: boolean,
  // Filter only requests using profanity_filter feature
  profanity_filter?: boolean,
  // Filter only requests using keywords feature
  keywords?: boolean,
  // Filter only requests using sentiment feature
  sentiment?: boolean,
  // Filter only requests using diarization feature
  diarize?: boolean,
  // Filter only requests using detect_language feature
  detect_language?: boolean,
  // Filter only requests using search feature
  search?: boolean,
  // Filter only requests using redact feature
  redact?: boolean,
  // Filter only requests using alternatives feature
  alternatives?: boolean,
  // Filter only requests using numerals feature
  numerals?: boolean
}
```

#### Get Usage Response

```ts
{
  start: string,
  end: string,
  resolution: {
    units: string,
    amount: number
  };
  results: [
    {
      start: string,
      end: string,
      hours: number,
      requests: number
    }
  ];
}
```

### Get Fields

Retrieves features used by the provided projectId based on the provided options.

```js
const response = await deepgram.usage.getUsage(PROJECT_ID, {
  start: "2020-01-01T00:00:00+00:00",
  // other options are available
});
```

#### Get Fields Options

```js
{
  // The time to retrieve requests made since
  // Example: "2020-01-01T00:00:00+00:00"
  start?: string,
  // The time to retrieve requests made until
  // Example: "2021-01-01T00:00:00+00:00"
  end?: string
}
```

#### Get Fields Response

```ts
{
  tags: Array<string>,
  models: Array<string>,
  processing_methods: Array<string>,
  languages: Array<string>,
  features: Array<string>
}
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
- Tweet at us! We're [@DeepgramDevs on Twitter](https://twitter.com/DeepgramDevs)

## Further Reading

Check out the Developer Documentation at [https://developers.deepgram.com/](https://developers.deepgram.com/)

[signup]: https://console.deepgram.com?utm_source=node-sdk&utm_content=readme
[license]: LICENSE.txt
