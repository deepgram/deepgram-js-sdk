/**
 * Example: Live Transcription via WebSocket (V2 API) with Ping Keepalive
 *
 * Connect to Deepgram's websocket V2 API and transcribe live streaming audio.
 * V2 API provides a simpler interface with turn-based transcription.
 *
 * This example demonstrates using WebSocket ping frames to keep the connection
 * alive during periods when no audio is being sent.
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
  let pingInterval = null;

  try {
    const deepgramConnection = await deepgramClient.listen.v2.connect({
      model: "flux-general-en",
      // V2 API parameters - model is required
      // encoding and sample_rate are optional and may be auto-detected
    });

    // Set up event handlers before connecting
    deepgramConnection.on("open", () => {
      console.log("Connection opened");

      // Start sending pings every 5 seconds to keep the connection alive
      // This is especially useful during periods of silence when no audio is being sent
      console.log("Starting ping keepalive every 5 seconds...");
      pingInterval = setInterval(() => {
        try {
          deepgramConnection.ping();
          console.log("[Keepalive] Ping sent at", new Date().toISOString());
        } catch (error) {
          console.error("[Keepalive] Ping failed:", error.message);
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }
        }
      }, 5000);
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
      // Clean up ping interval when connection closes
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
        console.log("[Keepalive] Ping interval cleared");
      }
    });

    // Connect to the websocket
    deepgramConnection.connect();

    // Wait for connection to open before sending data
    try {
      await deepgramConnection.waitForOpen();

      // Example: Send audio data from a file stream
      const audioStream = createReadStream("./examples/spacewalk.wav");
      let audioEnded = false;

      audioStream.on("data", (chunk) => {
        // Send binary audio data using sendMedia
        deepgramConnection.sendMedia(chunk);
      });

      audioStream.on("end", () => {
        console.log("Audio stream ended");
        audioEnded = true;

        // After audio ends, keep the connection alive with pings for 30 seconds
        // to demonstrate the keepalive functionality
        console.log("Keeping connection alive with pings for 30 seconds...");

        setTimeout(() => {
          console.log("Keepalive demo complete, closing stream");
          // Close the stream when done
          deepgramConnection.sendCloseStream({ type: "CloseStream" });
          // Connection will close after receiving final results
        }, 30000);
      });

      // Kill websocket after 90 seconds total (30s audio + 30s keepalive + 30s buffer)
      setTimeout(() => {
        console.log("Timeout reached, closing connection");
        deepgramConnection.close();
        process.exit(0);
      }, 90000);
    } catch (error) {
      console.error("Error waiting for connection:", error);
      deepgramConnection.close();
    }
  } catch (error) {
    console.error("Error setting up connection:", error);
  }
}

liveTranscriptionV2();

