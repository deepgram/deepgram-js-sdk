const { createClient, LiveTranscriptionEvents } = require("../../dist/main/index");
require("dotenv").config();

// Example showing the architecture ready for flux model
const fluxReadyExample = async () => {
  // Register global middleware that will work with any future events
  const { ListenClient } = require("../../dist/main/index");
  ListenClient.use({
    event: "Results",
    before: (payload) => {
      // Add processing timestamp
      payload._processed_at = Date.now();
      console.log("🔧 Global middleware: Processing transcript...");
    },
    after: (payload) => {
      // Log processing time
      const processingTime = Date.now() - payload._processed_at;
      console.log(`🔧 Global middleware: Processed in ${processingTime}ms`);
    },
  });

  // Example middleware for any future events (like flux events)
  ListenClient.use({
    event: "*", // This would catch any event type
    before: (payload, ctx) => {
      console.log(
        `🔧 Universal middleware: Event ${payload.type} received on session ${ctx.session.namespace}`
      );
    },
  });

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // Connect to v2 endpoint - this will automatically get supervision
  const connection = deepgram.v("v2").listen.live({
    model: "nova-3", // Ready to be changed to "flux" when available
    interim_results: true,
    smart_format: true,
  });

  // Add instance-specific middleware that could handle flux events
  connection.use({
    event: "SpeechStarted",
    before: () => {
      console.log("🎤 Instance middleware: User started speaking");
    },
  });

  // Ready for flux events - when they become available, they'll work with this architecture
  connection.use({
    event: "ConversationTurn", // Flux event (when available)
    before: (data) => {
      console.log(`🔄 Flux middleware ready: Turn ${data.turn_id} by ${data.speaker}`);
    },
  });

  connection.use({
    event: "SentimentAnalysis", // Flux event (when available)
    before: (data) => {
      console.log(`😊 Flux middleware ready: Sentiment ${data.sentiment} (${data.score})`);
    },
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("✅ Connection opened to Listen v2 (flux-ready architecture)");

    // Test the enhanced features
    console.log("Current turn count:", connection._turnCount ? connection._turnCount() : 0);
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log("📝 Transcript:", data.channel.alternatives[0].transcript);
    console.log("⏱️  Processing timestamp:", data._processed_at);
    console.log("🔢 Turn count:", connection._turnCount ? connection._turnCount() : 0);
  });

  connection.on(LiveTranscriptionEvents.Metadata, (data) => {
    console.log("📊 Metadata received:", {
      request_id: data.request_id,
      model: data.model_info?.name,
    });
  });

  // Enhanced events from the architecture
  connection.on("turn_started", (data) => {
    console.log(`🔄 Turn ${data.turn} started (${data.speaker})`);
  });

  connection.on("reconnecting", (data) => {
    console.log(`🔄 Reconnecting... attempt ${data.attempt}, delay ${data.delay}ms`);
  });

  connection.on("reconnected", (data) => {
    console.log(`✅ Reconnected after ${data.attempts} attempts`);
  });

  connection.on("middleware_error", (data) => {
    console.error(`❌ Middleware error on ${data.event}:`, data.error);
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error("❌ Connection error:", error);
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log("🔌 Connection closed");
  });

  // Simulate some audio (in a real app, you'd pipe actual audio)
  setTimeout(() => {
    console.log("📡 Simulating audio data...");
    // In a real application, you would send actual audio data here
    // connection.send(audioBuffer);
  }, 1000);

  // Keep alive for demonstration
  setTimeout(() => {
    connection.finish();
  }, 10000);
};

if (require.main === module) {
  console.log("🚀 Starting flux-ready Listen v2 example...");
  fluxReadyExample().catch(console.error);
}

module.exports = { fluxReadyExample };
