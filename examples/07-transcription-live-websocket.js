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
        // Send binary audio data using sendMedia
        deepgramConnection.sendMedia(chunk);
      });

      audioStream.on("end", () => {
        deepgramConnection.sendFinalize({ type: "Finalize" });
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
