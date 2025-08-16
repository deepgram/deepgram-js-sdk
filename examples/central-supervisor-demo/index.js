const { createClient, Supervisor, LiveTranscriptionEvents } = require("../../dist/main/index");
require("dotenv").config();

// Example showing how the central supervisor can be configured for different client types
const centralSupervisorDemo = async () => {
  console.log("🚀 Central Supervisor Architecture Demo");

  // Example 1: Listen v2 (automatically configured)
  console.log("\n📡 Example 1: Listen v2 (automatic supervision)");
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const listenConnection = deepgram.v("v2").listen.live({
    model: "nova-3",
    interim_results: true,
  });

  listenConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log("✅ Listen v2 connection opened with automatic supervision");
    console.log("Turn count available:", typeof listenConnection._turnCount === "function");
  });

  // Example 2: Custom supervision for a hypothetical Agent v2
  console.log("\n🤖 Example 2: Custom Agent supervision (demonstration)");

  // This shows how you could configure supervision for other client types
  const agentConfig = {
    clientType: "agent",
    version: "v2",
    builtinMiddlewares: [
      {
        event: "ConversationText",
        before: (payload) => {
          console.log(`🔧 Agent middleware: Processing ${payload.role} message`);
        },
      },
    ],
    builtinPlugins: [
      {
        plugin: (options = {}) => ({
          attach: (session, api) => {
            console.log(`🔌 Agent plugin attached with options:`, options);

            // Custom agent turn tracking
            let conversationTurns = 0;
            api.on("ConversationText", (data) => {
              if (data.role === "user") {
                conversationTurns++;
                api.emit("agent_turn_started", { turn: conversationTurns, type: "user" });
              }
            });

            // Store turn count
            session._agentTurnCount = () => conversationTurns;
          },
        }),
        options: { trackConversations: true },
      },
    ],
  };

  // Example 3: Speak v2 supervision (demonstration)
  console.log("\n🗣️  Example 3: Custom Speak supervision (demonstration)");

  const speakConfig = {
    clientType: "speak",
    version: "v2",
    builtinMiddlewares: [
      {
        event: "Audio",
        before: (payload) => {
          console.log(`🔧 Speak middleware: Processing audio chunk of ${payload.length} bytes`);
        },
      },
    ],
    builtinPlugins: [
      {
        plugin: (options = {}) => ({
          attach: (session, api) => {
            console.log(`🔌 Speak plugin attached for TTS tracking`);

            // Track TTS synthesis
            let synthesisCount = 0;
            api.on("Audio", () => {
              synthesisCount++;
            });

            session._synthesisCount = () => synthesisCount;
          },
        }),
        options: { trackSynthesis: true },
      },
    ],
  };

  // Example 4: Global middleware registration for different client types
  console.log("\n🌐 Example 4: Global middleware registration");

  // Register global middleware for listen v2
  Supervisor.use("listen", "v2", {
    event: "Results",
    before: (payload) => {
      console.log("🔧 Global Listen v2 middleware: Processing transcript");
    },
  });

  // Register global middleware for agent v2 (hypothetical)
  Supervisor.use("agent", "v2", {
    event: "ConversationText",
    before: (payload) => {
      console.log(`🔧 Global Agent v2 middleware: Processing ${payload.role} message`);
    },
  });

  // Register global middleware for speak v2 (hypothetical)
  Supervisor.use("speak", "v2", {
    event: "Audio",
    before: (payload) => {
      console.log(`🔧 Global Speak v2 middleware: Processing ${payload.length} byte audio`);
    },
  });

  console.log("\n✨ Central supervisor configurations demonstrated!");
  console.log("The architecture now supports:");
  console.log("- ✅ Configurable supervision per client type/version");
  console.log("- ✅ Custom middleware and plugins per client type");
  console.log("- ✅ Global middleware registration per client type/version");
  console.log("- ✅ Separation of concerns between client types");
  console.log("- ✅ Reusable supervision components");

  // Clean up
  setTimeout(() => {
    listenConnection.finish();
  }, 2000);
};

if (require.main === module) {
  centralSupervisorDemo().catch(console.error);
}

module.exports = { centralSupervisorDemo };
