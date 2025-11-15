# WebSocket Reference

## Listen V1 Connect

<details><summary><code>client.listen.v1.<a href="src/api/resources/listen/resources/v1/client/Client.ts">connect</a>(...)</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transcribe audio and video using Deepgram's speech-to-text WebSocket

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    apiKey: "YOUR_API_KEY",
});

const connection = await client.listen.v1.connect({
    model: "nova-3"
});

connection.on("open", () => {
    console.log("Connection opened");
});

connection.on("message", (message) => {
    const msgType = message?.type || "Unknown";
    console.log(`Received ${msgType} event`);
});

connection.on("close", () => {
    console.log("Connection closed");
});

connection.on("error", (error) => {
    console.log(`Caught: ${error.message || error}`);
});

// Send audio data
connection.sendListenV1Media(audioData);

// Send control messages
connection.sendListenV1KeepAlive({ type: "KeepAlive" });
connection.sendListenV1Finalize({ type: "Finalize" });

// Close the connection when done
connection.close();
```

</dd>
</dl>
</dd>
</dl>

#### 📤 Send Methods

<dl>
<dd>

<dl>
<dd>

**`sendListenV1Media(message)`** — Send binary audio data for transcription

- `audioData: string` — Binary audio data as a string

</dd>
</dl>

<dl>
<dd>

**`sendListenV1KeepAlive(message)`** — Keep the connection alive

- `{ type: "KeepAlive" }`

</dd>
</dl>

<dl>
<dd>

**`sendListenV1Finalize(message)`** — Finalize the transcription

- `{ type: "Finalize" }`

</dd>
</dl>

<dl>
<dd>

**`sendListenV1CloseStream(message)`** — Close the audio stream

- `{ type: "CloseStream" }`

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**model:** `string` — AI model to use for the transcription (required)

</dd>
</dl>

<dl>
<dd>

**callback:** `string | undefined` — URL to which we'll make the callback request

</dd>
</dl>

<dl>
<dd>

**callback_method:** `string | undefined` — HTTP method by which the callback request will be made

</dd>
</dl>

<dl>
<dd>

**channels:** `string | undefined` — Number of independent audio channels contained in submitted audio

</dd>
</dl>

<dl>
<dd>

**diarize:** `string | undefined` — Recognize speaker changes. Each word in the transcript will be assigned a speaker number starting at 0

</dd>
</dl>

<dl>
<dd>

**dictation:** `string | undefined` — Dictation mode for controlling formatting with dictated speech

</dd>
</dl>

<dl>
<dd>

**encoding:** `string | undefined` — Specify the expected encoding of your submitted audio

</dd>
</dl>

<dl>
<dd>

**endpointing:** `string | undefined` — Control when speech recognition ends

</dd>
</dl>

<dl>
<dd>

**extra:** `string | undefined` — Arbitrary key-value pairs that are attached to the API response

</dd>
</dl>

<dl>
<dd>

**interim_results:** `string | undefined` — Return partial transcripts as audio is being processed

</dd>
</dl>

<dl>
<dd>

**keyterm:** `string | undefined` — Key term prompting can boost or suppress specialized terminology and brands

</dd>
</dl>

<dl>
<dd>

**keywords:** `string | undefined` — Keywords can boost or suppress specialized terminology and brands

</dd>
</dl>

<dl>
<dd>

**language:** `string | undefined` — BCP-47 language tag that hints at the primary spoken language

</dd>
</dl>

<dl>
<dd>

**mip_opt_out:** `string | undefined` — Opts out requests from the Deepgram Model Improvement Program

</dd>
</dl>

<dl>
<dd>

**multichannel:** `string | undefined` — Transcribe each audio channel independently

</dd>
</dl>

<dl>
<dd>

**numerals:** `string | undefined` — Convert numbers from written format to numerical format

</dd>
</dl>

<dl>
<dd>

**profanity_filter:** `string | undefined` — Remove profanity from transcripts

</dd>
</dl>

<dl>
<dd>

**punctuate:** `string | undefined` — Add punctuation and capitalization to the transcript

</dd>
</dl>

<dl>
<dd>

**redact:** `string | undefined` — Redaction removes sensitive information from your transcripts

</dd>
</dl>

<dl>
<dd>

**replace:** `string | undefined` — Search for terms or phrases in submitted audio and replaces them

</dd>
</dl>

<dl>
<dd>

**sample_rate:** `string | undefined` — Sample rate of the submitted audio

</dd>
</dl>

<dl>
<dd>

**search:** `string | undefined` — Search for terms or phrases in submitted audio

</dd>
</dl>

<dl>
<dd>

**smart_format:** `string | undefined` — Apply formatting to transcript output for improved readability

</dd>
</dl>

<dl>
<dd>

**tag:** `string | undefined` — Label your requests for the purpose of identification during usage reporting

</dd>
</dl>

<dl>
<dd>

**utterance_end_ms:** `string | undefined` — Length of time in milliseconds of silence to wait for before finalizing speech

</dd>
</dl>

<dl>
<dd>

**vad_events:** `string | undefined` — Return Voice Activity Detection events via the websocket

</dd>
</dl>

<dl>
<dd>

**version:** `string | undefined` — Version of the model to use

</dd>
</dl>

<dl>
<dd>

**Authorization:** `string` — Use your API key for authentication, or alternatively generate a temporary token and pass it via the token query parameter.

**Example:** `token %DEEPGRAM_API_KEY%` or `bearer %DEEPGRAM_TOKEN%`

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string> | undefined` — Arbitrary headers to send with the websocket connect request

</dd>
</dl>

<dl>
<dd>

**debug:** `boolean | undefined` — Enable debug mode on the websocket. Defaults to false

</dd>
</dl>

<dl>
<dd>

**reconnectAttempts:** `number | undefined` — Number of reconnect attempts. Defaults to 30

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Listen V2 Connect

<details><summary><code>client.listen.v2.<a href="src/api/resources/listen/resources/v2/client/Client.ts">connect</a>(...)</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Real-time conversational speech recognition with contextual turn detection for natural voice conversations

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    apiKey: "YOUR_API_KEY",
});

const connection = await client.listen.v2.connect({
    model: "flux-general-en",
    encoding: "linear16",
    sample_rate: "16000"
});

connection.on("open", () => {
    console.log("Connection opened");
});

connection.on("message", (message) => {
    const msgType = message?.type || "Unknown";
    console.log(`Received ${msgType} event`);
});

connection.on("close", () => {
    console.log("Connection closed");
});

connection.on("error", (error) => {
    console.log(`Caught: ${error.message || error}`);
});

// Send audio data
connection.sendListenV2Media(audioData);

// Send control messages
connection.sendListenV2CloseStream({ type: "CloseStream" });

// Close the connection when done
connection.close();
```

</dd>
</dl>
</dd>
</dl>

#### 📤 Send Methods

<dl>
<dd>

<dl>
<dd>

**`sendListenV2Media(message)`** — Send binary audio data for transcription

- `audioData: string` — Binary audio data as a string

</dd>
</dl>

<dl>
<dd>

**`sendListenV2CloseStream(message)`** — Close the audio stream

- `{ type: "CloseStream" }`

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**model:** `string` — AI model used to process submitted audio (required)

</dd>
</dl>

<dl>
<dd>

**encoding:** `string` — Specify the expected encoding of your submitted audio (required)

</dd>
</dl>

<dl>
<dd>

**sample_rate:** `string` — Sample rate of the submitted audio (required)

</dd>
</dl>

<dl>
<dd>

**eager_eot_threshold:** `string | undefined` — Threshold for eager end-of-turn detection

</dd>
</dl>

<dl>
<dd>

**eot_threshold:** `string | undefined` — Threshold for end-of-turn detection

</dd>
</dl>

<dl>
<dd>

**eot_timeout_ms:** `string | undefined` — Timeout in milliseconds for end-of-turn detection

</dd>
</dl>

<dl>
<dd>

**keyterm:** `string | undefined` — Key term prompting can boost or suppress specialized terminology and brands

</dd>
</dl>

<dl>
<dd>

**mip_opt_out:** `string | undefined` — Opts out requests from the Deepgram Model Improvement Program

</dd>
</dl>

<dl>
<dd>

**tag:** `string | undefined` — Label your requests for the purpose of identification during usage reporting

</dd>
</dl>

<dl>
<dd>

**Authorization:** `string` — Use your API key for authentication, or alternatively generate a temporary token and pass it via the token query parameter.

**Example:** `token %DEEPGRAM_API_KEY%` or `bearer %DEEPGRAM_TOKEN%`

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string> | undefined` — Arbitrary headers to send with the websocket connect request

</dd>
</dl>

<dl>
<dd>

**debug:** `boolean | undefined` — Enable debug mode on the websocket. Defaults to false

</dd>
</dl>

<dl>
<dd>

**reconnectAttempts:** `number | undefined` — Number of reconnect attempts. Defaults to 30

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Speak V1 Connect

<details><summary><code>client.speak.v1.<a href="src/api/resources/speak/resources/v1/client/Client.ts">connect</a>(...)</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Convert text into natural-sounding speech using Deepgram's TTS WebSocket

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    apiKey: "YOUR_API_KEY",
});

const connection = await client.speak.v1.connect({
    model: "aura-2-asteria-en",
    encoding: "linear16",
    sample_rate: 24000
});

connection.on("open", () => {
    console.log("Connection opened");
});

connection.on("message", (message) => {
    if (message instanceof Buffer || message instanceof ArrayBuffer) {
        console.log("Received audio event");
    } else {
        const msgType = message?.type || "Unknown";
        console.log(`Received ${msgType} event`);
    }
});

connection.on("close", () => {
    console.log("Connection closed");
});

connection.on("error", (error) => {
    console.log(`Caught: ${error.message || error}`);
});

// Send text to be converted to speech
connection.sendSpeakV1Text({ type: "Speak", text: "Hello, world!" });

// Send control messages
connection.sendSpeakV1Flush({ type: "Flush" });
connection.sendSpeakV1Clear({ type: "Clear" });
connection.sendSpeakV1Close({ type: "Close" });

// Close the connection when done
connection.close();
```

</dd>
</dl>
</dd>
</dl>

#### 📤 Send Methods

<dl>
<dd>

<dl>
<dd>

**`sendSpeakV1Text(message)`** — Send text to be converted to speech

- `{ type: "Speak", text: "Hello, world!" }`

</dd>
</dl>

<dl>
<dd>

**`sendSpeakV1Flush(message)`** — Process all queued text immediately

- `{ type: "Flush" }`

</dd>
</dl>

<dl>
<dd>

**`sendSpeakV1Clear(message)`** — Clear the text queue

- `{ type: "Clear" }`

</dd>
</dl>

<dl>
<dd>

**`sendSpeakV1Close(message)`** — Close the connection

- `{ type: "Close" }`

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**encoding:** `string | undefined` — Specify the expected encoding of your output audio

</dd>
</dl>

<dl>
<dd>

**mip_opt_out:** `string | undefined` — Opts out requests from the Deepgram Model Improvement Program

</dd>
</dl>

<dl>
<dd>

**model:** `string | undefined` — AI model used to process submitted text

</dd>
</dl>

<dl>
<dd>

**sample_rate:** `string | undefined` — Sample rate for the output audio

</dd>
</dl>

<dl>
<dd>

**Authorization:** `string` — Use your API key for authentication, or alternatively generate a temporary token and pass it via the token query parameter.

**Example:** `token %DEEPGRAM_API_KEY%` or `bearer %DEEPGRAM_TOKEN%`

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string> | undefined` — Arbitrary headers to send with the websocket connect request

</dd>
</dl>

<dl>
<dd>

**debug:** `boolean | undefined` — Enable debug mode on the websocket. Defaults to false

</dd>
</dl>

<dl>
<dd>

**reconnectAttempts:** `number | undefined` — Number of reconnect attempts. Defaults to 30

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Agent V1 Connect

<details><summary><code>client.agent.v1.<a href="src/api/resources/agent/resources/v1/client/Client.ts">connect</a>(...)</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Build a conversational voice agent using Deepgram's Voice Agent WebSocket

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    apiKey: "YOUR_API_KEY",
});

const agent = await client.agent.v1.connect();

// Configure the agent
const settings = {
    audio: {
        input: {
            encoding: "linear16",
            sample_rate: 44100,
        }
    },
    agent: {
        listen: {
            provider: {
                type: "deepgram",
                model: "nova-3",
                smart_format: true,
            }
        },
        think: {
            provider: {
                type: "open_ai",
                model: "gpt-4o-mini",
                temperature: 0.7,
            },
            prompt: 'Reply only and explicitly with "OK".',
        },
        speak: {
            provider: {
                type: "deepgram",
                model: "aura-2-asteria-en",
            }
        },
    },
};

agent.sendAgentV1Settings(settings);

agent.on("open", () => {
    console.log("Connection opened");
});

agent.on("message", (message) => {
    if (message instanceof Buffer || message instanceof ArrayBuffer) {
        console.log("Received audio event");
    } else {
        const msgType = message?.type || "Unknown";
        console.log(`Received ${msgType} event`);
    }
});

agent.on("close", () => {
    console.log("Connection closed");
});

agent.on("error", (error) => {
    console.log(`Caught: ${error.message || error}`);
});

// Send audio data
agent.sendAgentV1Media(audioData);

// Send control messages
agent.sendAgentV1KeepAlive({ type: "KeepAlive" });

// Close the connection when done
agent.close();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**Authorization:** `string` — Use your API key for authentication, or alternatively generate a temporary token and pass it via the token query parameter.

**Example:** `token %DEEPGRAM_API_KEY%` or `bearer %DEEPGRAM_TOKEN%`

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string> | undefined` — Arbitrary headers to send with the websocket connect request

</dd>
</dl>

<dl>
<dd>

**debug:** `boolean | undefined` — Enable debug mode on the websocket. Defaults to false

</dd>
</dl>

<dl>
<dd>

**reconnectAttempts:** `number | undefined` — Number of reconnect attempts. Defaults to 30

</dd>
</dl>
</dd>
</dl>

#### 📤 Send Methods

<dl>
<dd>

<dl>
<dd>

**`sendAgentV1Settings(message)`** — Send initial agent configuration settings

- Configure audio, listen, think, and speak providers

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1Media(message)`** — Send binary audio data to the agent

- `audioData: string` — Binary audio data as a string

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1KeepAlive(message)`** — Keep the connection alive

- `{ type: "KeepAlive" }`

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1UpdateSpeak(message)`** — Update the agent's speech synthesis settings

- Modify TTS configuration during conversation

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1UpdatePrompt(message)`** — Update the agent's system prompt

- Change the agent's behavior instructions

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1InjectUserMessage(message)`** — Inject a user message into the conversation

- Add a simulated user input

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1InjectAgentMessage(message)`** — Inject an agent message into the conversation

- Add a simulated agent response

</dd>
</dl>

<dl>
<dd>

**`sendAgentV1SendFunctionCallResponse(message)`** — Send the result of a function call back to the agent

- Provide function execution results

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

