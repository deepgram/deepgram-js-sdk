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
  try {
    const deepgramConnection = await deepgramClient.speak.v1.connect({
      model: "aura-2-thalia-en",
      encoding: "linear16",
    });

    // Set up event handlers before connecting
    deepgramConnection.on("open", () => {
      console.log("Connection opened");
    });

    let audioReceived = false;
    let flushed = false;
    
    deepgramConnection.on("message", (data) => {
      // Check message type
      if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) {
        // Audio data comes as string (base64 encoded)
        audioReceived = true;
        console.log("Audio received (length):", data instanceof ArrayBuffer ? data.byteLength : data instanceof Blob ? data.size : data.length);
        // Process audio data - decode base64 if needed
      } else if (data.type === "Metadata") {
        console.log("Metadata:", data);
      } else if (data.type === "Flushed") {
        console.log("Flushed:", data);
        flushed = true;
        // Wait a moment for any remaining audio, then close
        setTimeout(() => {
          deepgramConnection.close();
        }, 1000);
      } else {
        console.log("Unknown message type:", data);
      }
    });

    deepgramConnection.on("error", (error) => {
      console.error("Error:", error);
    });

    deepgramConnection.on("close", () => {
      console.log("Connection closed");
    });

    // Connect to the websocket
    deepgramConnection.connect();

    // Wait for connection to open before sending data
    try {
      await deepgramConnection.waitForOpen();

      const text =
        "Hello, this is a test of Deepgram's streaming text-to-speech API.";

      // Send text data for TTS synthesis
      // Note: Text requires type: "Speak"
      deepgramConnection.sendText({ type: "Speak", text });

      // Send Flush message to the server after sending the text
      // Note: Flush requires type: "Flush"
      deepgramConnection.sendFlush({ type: "Flush" });

      // Connection will close automatically when Flushed message is received
      // But set a timeout as fallback in case Flushed never comes
      setTimeout(() => {
        if (!flushed) {
          console.log("Timeout waiting for Flushed message, closing connection");
          deepgramConnection.close();
        }
      }, 10000);

      // Kill websocket after 1 minute, so we can run these in CI
      setTimeout(() => {
        deepgramConnection.close();
        process.exit(0);
      }, 60000);
    } catch (error) {
      console.error("Error waiting for connection:", error);
      deepgramConnection.close();
    }
  } catch (error) {
    console.error("Error setting up connection:", error);
  }
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
