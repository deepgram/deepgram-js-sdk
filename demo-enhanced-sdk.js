#!/usr/bin/env node

// Demo script showing the enhanced SDK features
const { createClient, ListenV2, LiveTranscriptionEvents } = require("./dist/main/index");

console.log("🚀 Deepgram Enhanced SDK Demo\n");

// 1. Global middleware registration
console.log("1️⃣ Registering global middleware for all Listen v2 sessions...");
ListenV2.use({
  event: "Results",
  before: (payload) => {
    payload._enhanced_timestamp = Date.now();
    console.log("   🔧 Before middleware: Added timestamp to transcript");
  },
  after: (payload) => {
    const processingTime = Date.now() - payload._enhanced_timestamp;
    console.log(`   🔧 After middleware: Processing took ${processingTime}ms`);
  },
});

ListenV2.use({
  event: "Metadata",
  before: (metadata) => {
    console.log("   🔧 Metadata middleware: Session info received");
    if (metadata.session_id) {
      console.log(`   📋 Session ID: ${metadata.session_id}`);
    }
  },
});

// 2. Create enhanced client
console.log("\n2️⃣ Creating enhanced Deepgram client...");
const deepgram = createClient({ key: "demo-key" });

// 3. Test regular v1 connection (no supervision)
console.log("\n3️⃣ Creating v1 connection (no supervision)...");
try {
  const v1Connection = deepgram.listen.live({ model: "nova-3" });
  console.log("   ✅ v1 connection created");
  console.log("   📝 Has .use() method:", typeof v1Connection.use === "function" ? "Yes" : "No");
  v1Connection.disconnect();
} catch (e) {
  console.log(
    "   ⚠️ v1 connection failed (expected without API key):",
    e.message.substring(0, 50) + "..."
  );
}

// 4. Test v2 connection (with supervision)
console.log("\n4️⃣ Creating v2 connection (with supervision)...");
try {
  const v2Connection = deepgram.v("v2").listen.live({ model: "nova-3" });
  console.log("   ✅ v2 connection created");
  console.log("   📝 Has .use() method:", typeof v2Connection.use === "function" ? "Yes" : "No");
  console.log(
    "   📝 Has ._turnCount() method:",
    typeof v2Connection._turnCount === "function" ? "Yes" : "No"
  );

  // Add instance-specific middleware
  console.log("\n5️⃣ Adding instance-specific middleware...");
  v2Connection.use({
    event: "SpeechStarted",
    before: () => console.log("   🎤 Instance middleware: User started speaking"),
  });

  console.log("   ✅ Instance middleware added");

  // Set up event listeners to show enhanced events
  v2Connection.on("turn_started", (data) => {
    console.log(`   🔄 Enhanced event: Turn ${data.turn} started (${data.speaker})`);
  });

  v2Connection.on("reconnecting", (data) => {
    console.log(`   🔄 Enhanced event: Reconnecting (attempt ${data.attempt})`);
  });

  v2Connection.on("reconnected", (data) => {
    console.log(`   ✅ Enhanced event: Reconnected after ${data.attempts} attempts`);
  });

  v2Connection.disconnect();
} catch (e) {
  console.log(
    "   ⚠️ v2 connection failed (expected without API key):",
    e.message.substring(0, 50) + "..."
  );
}

console.log("\n🎉 Demo completed!");
console.log("\n📚 Key Features Demonstrated:");
console.log("   • Global middleware registration via ListenV2.use()");
console.log("   • Instance-specific middleware via connection.use()");
console.log("   • Automatic v2 supervision with turn counting");
console.log("   • Enhanced events: turn_started, reconnecting, reconnected");
console.log("   • Backward compatibility - v1 connections unchanged");
console.log("   • Same public API - zero breaking changes");

console.log("\n🔗 Usage:");
console.log("   // v1 (unchanged)");
console.log("   const conn1 = deepgram.listen.live(options);");
console.log("   ");
console.log("   // v2 (enhanced)");
console.log("   const conn2 = deepgram.v('v2').listen.live(options);");
console.log("   conn2.use({ event: 'Results', before: (data) => { ... } });");
