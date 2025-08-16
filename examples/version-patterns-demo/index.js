const { createClient, LiveTranscriptionEvents } = require("../../dist/main/index");
require("dotenv").config();

// Demonstration that both version patterns result in identical supervision
const versionPatternsDemo = async () => {
  console.log("🔄 Version Patterns Equivalence Demo");
  console.log("=====================================");

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // Pattern 1: client.v("v2").listen.live()
  console.log("\n📡 Pattern 1: client.v('v2').listen.live()");
  const connection1 = deepgram.v("v2").listen.live({
    model: "nova-3",
    interim_results: true,
  });

  // Pattern 2: client.listen.v("v2").live()
  console.log("📡 Pattern 2: client.listen.v('v2').live()");
  const connection2 = deepgram.listen.v("v2").live({
    model: "nova-3",
    interim_results: true,
  });

  // Verify both have supervision features
  console.log("\n🔍 Supervision Feature Comparison:");
  console.log("Pattern 1 has 'use' method:", typeof connection1.use === "function");
  console.log("Pattern 2 has 'use' method:", typeof connection2.use === "function");
  console.log("Pattern 1 has '_turnCount':", typeof connection1._turnCount === "function");
  console.log("Pattern 2 has '_turnCount':", typeof connection2._turnCount === "function");

  // Test middleware registration on both
  console.log("\n🔧 Testing middleware registration on both patterns:");

  connection1.use({
    event: "Results",
    before: (payload) => {
      payload._pattern1_processed = true;
      console.log("🔧 Pattern 1 middleware: Processing transcript");
    },
  });

  connection2.use({
    event: "Results",
    before: (payload) => {
      payload._pattern2_processed = true;
      console.log("🔧 Pattern 2 middleware: Processing transcript");
    },
  });

  // Set up event handlers to demonstrate equivalence
  connection1.on(LiveTranscriptionEvents.Open, () => {
    console.log("✅ Pattern 1: Connection opened with supervision");
    console.log("   Turn count available:", typeof connection1._turnCount === "function");
  });

  connection2.on(LiveTranscriptionEvents.Open, () => {
    console.log("✅ Pattern 2: Connection opened with supervision");
    console.log("   Turn count available:", typeof connection2._turnCount === "function");
  });

  connection1.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log("📝 Pattern 1 transcript:", data.channel.alternatives[0].transcript);
    console.log("   Pattern 1 processed:", !!data._pattern1_processed);
    console.log("   Turn count:", connection1._turnCount ? connection1._turnCount() : 0);
  });

  connection2.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log("📝 Pattern 2 transcript:", data.channel.alternatives[0].transcript);
    console.log("   Pattern 2 processed:", !!data._pattern2_processed);
    console.log("   Turn count:", connection2._turnCount ? connection2._turnCount() : 0);
  });

  // Enhanced events work on both
  connection1.on("turn_started", (data) => {
    console.log(`🔄 Pattern 1: Turn ${data.turn} started (${data.speaker})`);
  });

  connection2.on("turn_started", (data) => {
    console.log(`🔄 Pattern 2: Turn ${data.turn} started (${data.speaker})`);
  });

  console.log("\n✨ Both patterns provide identical supervision capabilities:");
  console.log("- ✅ Middleware registration (instance-level)");
  console.log("- ✅ Turn counting");
  console.log("- ✅ Reconnection handling");
  console.log("- ✅ Enhanced events (turn_started, reconnecting, etc.)");
  console.log("- ✅ Error handling and cleanup");

  // Clean up after demonstration
  setTimeout(() => {
    console.log("\n🧹 Cleaning up connections...");
    connection1.finish();
    connection2.finish();
  }, 2000);
};

if (require.main === module) {
  versionPatternsDemo().catch(console.error);
}

module.exports = { versionPatternsDemo };
