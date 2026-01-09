/**
 * Example: Live Transcription via WebSocket (V2 API)
 *
 * Connect to Deepgram's websocket V2 API and transcribe live streaming audio.
 * V2 API provides a simpler interface with turn-based transcription.
 * 
 * Note: V2 API may have different requirements or availability than V1.
 * If you encounter 400 errors, this may indicate:
 * - V2 API endpoint may not be publicly available yet
 * - Your API key may not have access to V2 endpoints
 * - Server-side validation may differ from V1
 * 
 * Please check with Deepgram support for V2 API availability and access requirements.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function liveTranscriptionV2() {
  try {
    const deepgramConnection = await deepgramClient.listen.v2.connect({
      model: "flux-general-en",
      // V2 API parameters - model is required
      // encoding and sample_rate are optional and may be auto-detected
    });

    // Set up event handlers before connecting
    deepgramConnection.on("open", () => {
      console.log("Connection opened");
    });

    deepgramConnection.on("message", (data) => {
      // Check message type
      if (data.type === "Connected") {
        console.log("Connected:", data);
      } else if (data.type === "TurnInfo") {
        console.log("Turn Info:", data);
      } else if (data.type === "FatalError") {
        console.error("Fatal Error:", data);
        deepgramConnection.close();
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
        deepgramConnection.sendListenV2Media(chunk);
      });

      audioStream.on("end", () => {
        // Close the stream when done
        deepgramConnection.sendListenV2CloseStream({ type: "CloseStream" });
        // Connection will close after receiving final results
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

liveTranscriptionV2();

