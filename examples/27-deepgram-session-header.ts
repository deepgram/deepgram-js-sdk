/**
 * Example: Deepgram Session Header
 *
 * This example demonstrates that the x-deepgram-session-id header is automatically
 * generated and sent with all REST requests and WebSocket connections.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Log the session ID that was generated
console.log("Generated Session ID:", deepgramClient.sessionId);
console.log("");

async function testRestRequest() {
  console.log("=== Testing REST Request ===");
  try {
    // Make a REST request - the session ID should be included in headers
    const data = await deepgramClient.manage.v1.projects.list();
    console.log("✓ REST request successful!");
    console.log("  Session ID was sent in x-deepgram-session-id header");
    console.log(`  Found ${data.projects?.length || 0} projects`);
    console.log("");
  } catch (error) {
    console.error("✗ REST request failed:", error.message);
    console.log("");
  }
}

async function testWebSocketConnection() {
  console.log("=== Testing WebSocket Connection ===");
  try {
    const deepgramConnection = await deepgramClient.listen.v1.connect({
      model: "nova-3",
      language: "en",
      punctuate: "true",
      interim_results: "true",
    });

    let connectionOpened = false;
    let receivedMessage = false;

    deepgramConnection.on("open", () => {
      connectionOpened = true;
      console.log("✓ WebSocket connection opened!");
      console.log("  Session ID was sent in x-deepgram-session-id header (Node.js)");
      console.log("  or as x-deepgram-session-id protocol (browser)");
    });

    deepgramConnection.on("message", (data) => {
      if (!receivedMessage) {
        receivedMessage = true;
        console.log("✓ Received message from WebSocket");
        if (data.type === "Metadata") {
          console.log("  Metadata received:", JSON.stringify(data, null, 2));
        }
      }
    });

    deepgramConnection.on("error", (error) => {
      console.error("✗ WebSocket error:", error.message);
    });

    deepgramConnection.on("close", () => {
      console.log("✓ WebSocket connection closed");
      console.log("");
    });

    // Connect to the websocket
    deepgramConnection.connect();

    // Wait for connection to open
    await deepgramConnection.waitForOpen();

    // Send a small amount of audio data
    const audioStream = createReadStream("./examples/spacewalk.wav");
    audioStream.on("data", (chunk) => {
      deepgramConnection.sendMedia(chunk);
    });

    audioStream.on("end", () => {
      deepgramConnection.sendFinalize({ type: "Finalize" });
      // Close after a short delay
      setTimeout(() => {
        deepgramConnection.close();
      }, 2000);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!connectionOpened) {
        console.error("✗ WebSocket connection timeout");
      }
      deepgramConnection.close();
    }, 10000);
  } catch (error) {
    console.error("✗ WebSocket connection failed:", error.message);
    console.log("");
  }
}

// Run tests
(async () => {
  await testRestRequest();
  await testWebSocketConnection();
  
  console.log("=== Summary ===");
  console.log(`Session ID: ${deepgramClient.sessionId}`);
  console.log("✓ All tests completed!");
  console.log("");
  console.log("Note: To verify the header is actually sent, you can:");
  console.log("  1. Use a network proxy (like mitmproxy) to inspect HTTP headers");
  console.log("  2. Check server logs if you have access");
  console.log("  3. Use browser DevTools Network tab for browser examples");
  
  // Give WebSocket time to complete
  setTimeout(() => {
    process.exit(0);
  }, 15000);
})();

