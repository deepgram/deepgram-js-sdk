/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTranscriptionEvents, ListenV2 } = require("../../dist/main/index");
require("dotenv").config();

// Example of using the enhanced Listen v2 with middleware
const enhancedLive = async () => {
  // Register global middleware for all Listen v2 sessions
  ListenV2.use({
    event: "Results",
    before: (payload) => {
      // Add processing timestamp
      payload._enhanced_at = Date.now();
      console.log("🔧 Middleware: Processing transcript...");
    },
    after: (payload) => {
      // Log processing time
      const processingTime = Date.now() - payload._enhanced_at;
      console.log(`🔧 Middleware: Processed in ${processingTime}ms`);
    },
  });

  ListenV2.use({
    event: "Metadata",
    before: (metadata) => {
      console.log("🔧 Middleware: Session metadata received:", {
        session_id: metadata.session_id,
        request_id: metadata.request_id,
      });
    },
  });

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // Connect to v2 endpoint - this will automatically get supervision
  const connection = deepgram.v("v2").listen.live({
    model: "nova-3",
  });

  // Add instance-specific middleware
  connection.use({
    event: "SpeechStarted",
    before: () => {
      console.log("🎤 Instance middleware: User started speaking");
    },
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("✅ Connection opened to Listen v2 (enhanced)");

    // Test the enhanced turn counting
    console.log("Current turn count:", connection._turnCount ? connection._turnCount() : 0);
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log("📝 Transcript:", data.channel.alternatives[0].transcript);
    console.log("⏱️  Enhanced timestamp:", data._enhanced_at);
    console.log("🔢 Turn count:", connection._turnCount ? connection._turnCount() : 0);
  });

  // New enhanced events
  connection.on("turn_started", (data) => {
    console.log(`🔄 Turn ${data.turn} started (${data.speaker})`);
  });

  connection.on("reconnecting", (data) => {
    console.log(`🔄 Reconnecting... (attempt ${data.attempt}, delay: ${data.delay}ms)`);
  });

  connection.on("reconnected", (data) => {
    console.log(`✅ Reconnected after ${data.attempts} attempts`);
  });

  connection.on("reconnect_failed", (data) => {
    console.log(`❌ Reconnection failed after ${data.attempts} attempts`);
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log("❌ Connection closed");
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error("🚨 Connection error:", error);
  });

  // Simulate some audio data
  setTimeout(() => {
    console.log("📡 Sending test audio data...");
    const testAudio = Buffer.from("test audio data");
    connection.send(testAudio);
  }, 1000);

  // Test graceful close after 10 seconds
  setTimeout(() => {
    console.log("🛑 Requesting close...");
    connection.requestClose();
  }, 10000);
};

enhancedLive().catch(console.error);
