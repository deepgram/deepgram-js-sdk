/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTranscriptionEvents, ListenV2 } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

const testV2MiddlewareOnV1Endpoint = async () => {
  console.log("🧪 Testing v2 middleware on v1 endpoint");
  console.log("=".repeat(50));

  // 1. Register global middleware for all v2 sessions
  console.log("\n1️⃣ Registering global middleware for Results events...");
  ListenV2.use({
    event: "Results",
    before: (payload, ctx) => {
      console.log("🔧 BEFORE middleware - Results received:");
      console.log(
        "   📝 Transcript:",
        payload.channel?.alternatives?.[0]?.transcript || "No transcript"
      );
      console.log("   🔢 Turn count:", ctx.turnCount || 0);
      console.log("   ⏱️  Adding timestamp...");
      payload._middleware_timestamp = Date.now();
    },
    after: (payload, ctx) => {
      const processingTime = Date.now() - payload._middleware_timestamp;
      console.log("🔧 AFTER middleware - Results processed:");
      console.log("   ⚡ Processing time:", processingTime + "ms");
      console.log("   🔢 Final turn count:", ctx.turnCount || 0);
      console.log("   " + "-".repeat(40));
    },
  });

  // 2. Add metadata middleware to show session info
  ListenV2.use({
    event: "Metadata",
    before: (metadata) => {
      console.log("🔧 METADATA middleware:");
      console.log("   📋 Request ID:", metadata.request_id);
      console.log("   🆔 Transaction Key:", metadata.transaction_key);
      if (metadata.model_info) {
        console.log("   🤖 Model:", metadata.model_info.name);
        console.log("   📊 Version:", metadata.model_info.version);
      }
    },
  });

  // 3. Create v2 client but connect to v1 endpoint
  console.log("\n2️⃣ Creating v2 client...");
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // Use v2 client (gets middleware) but specify v1 endpoint explicitly
  console.log("\n3️⃣ Connecting with v2 client to v1 endpoint...");
  const connection = deepgram.v("v2").listen.live(
    { model: "nova-3" },
    "v1/listen" // Explicitly use v1 endpoint
  );

  // Verify we have middleware capabilities
  console.log("   ✅ v2 client created");
  console.log("   📝 Has .use() method:", typeof connection.use === "function" ? "Yes" : "No");
  console.log(
    "   📝 Has ._turnCount() method:",
    typeof connection._turnCount === "function" ? "Yes" : "No"
  );

  // 4. Add instance-specific middleware
  console.log("\n4️⃣ Adding instance-specific middleware...");
  connection.use({
    event: "Results",
    before: (payload) => {
      console.log("🎯 INSTANCE middleware - Before Results:");
      console.log("   📍 Connection-specific processing");
      payload._instance_marker = "processed-by-instance";
    },
    after: (payload) => {
      console.log("🎯 INSTANCE middleware - After Results:");
      console.log("   ✅ Instance marker:", payload._instance_marker);
    },
  });

  // 5. Set up event listeners
  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("\n🟢 Connection opened to v1 endpoint with v2 middleware!");
    console.log("   🔄 Current turn count:", connection._turnCount ? connection._turnCount() : 0);

    // Stream some audio from BBC World Service
    console.log("\n5️⃣ Starting audio stream...");
    fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        console.log("   📡 Audio stream connected");
        res.on("readable", () => {
          const chunk = res.read();
          if (chunk) {
            connection.send(chunk);
          }
        });
      })
      .catch((err) => {
        console.log("   ⚠️ Audio stream failed:", err.message);
        // Send some test data instead
        setTimeout(() => {
          console.log("   📡 Sending test audio data...");
          const testAudio = Buffer.from("test audio data");
          connection.send(testAudio);
        }, 1000);
      });
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    // This event will trigger our middleware chain:
    // 1. Global before middleware
    // 2. Instance before middleware
    // 3. This event handler
    // 4. Instance after middleware
    // 5. Global after middleware
    console.log("📄 USER EVENT HANDLER - Transcript received:");
    console.log("   💬 Text:", data.channel.alternatives[0].transcript);
    console.log("   🏷️  Instance marker:", data._instance_marker);
    console.log("   ⏱️  Middleware timestamp:", data._middleware_timestamp);
  });

  connection.on(LiveTranscriptionEvents.Metadata, () => {
    console.log("📋 USER EVENT HANDLER - Metadata received");
  });

  // Enhanced events from v2 supervision
  connection.on("turn_started", (data) => {
    console.log(`🔄 ENHANCED EVENT - Turn ${data.turn} started (${data.speaker})`);
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log("\n🔴 Connection closed");
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error("🚨 Connection error:", error.message);
  });

  // Auto-close after 15 seconds
  setTimeout(() => {
    console.log("\n⏰ Test timeout - closing connection...");
    connection.requestClose();
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }, 15000);
};

console.log("🚀 Deepgram v2 Middleware Test on v1 Endpoint");
console.log("This test demonstrates:");
console.log("• v2 client middleware working on v1 endpoint");
console.log("• Global and instance middleware execution");
console.log("• Before/after middleware hooks on Results events");
console.log("• Turn counting and enhanced events");

testV2MiddlewareOnV1Endpoint().catch(console.error);
