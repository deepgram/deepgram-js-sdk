/**
 * Example: Live Transcription via WebSocket
 *
 * Connect to Deepgram's websocket and transcribe live streaming audio.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function liveTranscription() {
  try {
    const deepgramConnection = await deepgramClient.listen.v1.connect({
      model: "nova-3",
      language: "en",
      punctuate: "true",
      interim_results: "true",
      // Add more options as needed
    });

    // Set up event handlers before connecting
    deepgramConnection.on("open", () => {
      console.log("Connection opened");
    });

    let receivedFinal = false;
    deepgramConnection.on("message", (data) => {
      // Check message type
      if (data.type === "Results") {
        console.log("Transcript:", data);
        // Close after receiving final results
        if (data.is_final) {
          receivedFinal = true;
          setTimeout(() => {
            deepgramConnection.close();
          }, 1000); // Give a moment for any final messages
        }
      } else if (data.type === "Metadata") {
        console.log("Metadata:", data);
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

      // Example: Send audio data from a file stream
      const audioStream = createReadStream("./examples/spacewalk.wav");
      audioStream.on("data", (chunk) => {
        // Send binary audio data directly to the socket
        deepgramConnection.socket.sendBinary(chunk);
      });

      audioStream.on("end", () => {
        deepgramConnection.sendListenV1Finalize({ type: "Finalize" });
        // Don't close immediately - wait for final transcription results
        // The connection will be closed in the message handler when is_final is true
      });

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


liveTranscription();

/**
 * ERROR WE SEE:
Error: BadRequestError: BadRequestError
Status code: 400
Body: {
  "err_code": "Bad Request",
  "err_msg": "Invalid query string.",
  "request_id": "69a209af-bf0a-449a-8dca-50772d4c834d"
}
    at MediaClient.<anonymous> (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/api/resources/listen/resources/v1/resources/media/client/Client.js:298:31)
    at Generator.next (<anonymous>)
    at fulfilled (/home/naomi/code/deepgram/deepgram-js-sdk/dist/cjs/api/resources/listen/resources/v1/resources/media/client/Client.js:39:58)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5) {
  statusCode: 400,
  body: {
    err_code: 'Bad Request',
    err_msg: 'Invalid query string.',
    request_id: '69a209af-bf0a-449a-8dca-50772d4c834d'
  },
  rawResponse: {
    headers: Headers {
      'content-type': 'application/json',
      'dg-error': 'Invalid query string.',
      vary: 'origin, access-control-request-method, access-control-request-headers, accept-encoding',
      'access-control-allow-credentials': 'true',
      'access-control-expose-headers': 'dg-model-name,dg-model-uuid,dg-char-count,dg-request-id,dg-project-id,dg-error',
      'content-encoding': 'br',
      'dg-request-id': '69a209af-bf0a-449a-8dca-50772d4c834d',
      'transfer-encoding': 'chunked',
      date: 'Wed, 10 Dec 2025 21:35:23 GMT'
    },
    redirected: false,
    status: 400,
    statusText: 'Bad Request',
    type: 'basic',
    url: 'https://api.deepgram.com/v1/listen?callback=dpgr.am%2Fcallback&callback_method=POST&language=en&model=nova-3&punctuate=true'
  }
}
 */
