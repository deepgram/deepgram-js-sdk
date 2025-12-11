/**
 * Example: Text-to-Speech Streaming (WebSocket)
 *
 * Connect to Deepgram's websocket and send a continuous text stream to generate speech.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function textToSpeechStreaming() {
  const deepgramConnection = await deepgramClient.speak.v1.connect({
    model: "aura-2-thalia-en",
    encoding: "linear16",
  });

  deepgramConnection.on("error", (error) => {
    console.error("Error:", error);
  });

  deepgramConnection.on("close", () => {
    console.log("Connection closed");
  });

  deepgramConnection.on("open", () => {
    console.log("Connection opened");

    const text =
      "Hello, this is a test of Deepgram's streaming text-to-speech API.";

    // Send text data for TTS synthesis
    deepgramConnection.sendSpeakV1Text({ text });

    // Send Flush message to the server after sending the text
    deepgramConnection.sendSpeakV1Flush({});

    deepgramConnection.on("message", (data) => {
      // Check message type
      if (typeof data === "string") {
        // Audio data comes as string
        console.log("Audio received:", data);
        // Process audio data
      } else if (data.type === "Metadata") {
        console.log("Metadata:", data);
      }
    });
  });

  deepgramConnection.connect();
}

// Uncomment to run:
textToSpeechStreaming();

/**
 * > @deepgram/sdk-new@4.11.3 examples:11 /home/naomi/code/deepgram/deepgram-js-sdk
> node examples/11-text-to-speech-streaming.js

Connection closed
Connection closed
Error: Error: TIMEOUT
    at V1Socket.handleError (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/api/resources/speak/resources/v1/client/Socket.js:68:101)
    at ReconnectingWebSocket._callEventListener (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:410:13)
    at /home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:129:62
    at Array.forEach (<anonymous>)
    at ReconnectingWebSocket._handleError (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:129:35)
    at ReconnectingWebSocket._handleTimeout (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:383:14)
    at Timeout.<anonymous> (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:378:58)
    at listOnTimeout (node:internal/timers:605:17)
    at process.processTimers (node:internal/timers:541:7)
Error: Error: TIMEOUT
    at V1Socket.handleError (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/api/resources/speak/resources/v1/client/Socket.js:68:101)
    at ReconnectingWebSocket._callEventListener (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:410:13)
    at /home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:129:62
    at Array.forEach (<anonymous>)
    at ReconnectingWebSocket._handleError (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:129:35)
    at ReconnectingWebSocket._handleTimeout (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:383:14)
    at Timeout.<anonymous> (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/core/websocket/ws.js:378:58)
    at listOnTimeout (node:internal/timers:605:17)
    at process.processTimers (node:internal/timers:541:7)
 */
