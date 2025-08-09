/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

console.log("🔑 API Key loaded successfully");

const agent = async () => {
  // Check for API key
  if (!process.env.DEEPGRAM_API_KEY) {
    console.error("❌ Error: DEEPGRAM_API_KEY environment variable is required");
    console.log("💡 Run with: DEEPGRAM_API_KEY=your_api_key_here npm start");
    process.exit(1);
  }

  console.log("🚀 Starting Deepgram Agent Live example...");
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  console.log("📞 Connecting to Deepgram Agent API...");
  const connection = deepgram.agent();

  // Fix for SDK timing issue: manually attach event handlers after WebSocket is created
  setTimeout(() => {
    if (connection.conn) {
      connection.conn.onopen = () => connection.emit("Open", connection);
      connection.conn.onclose = (event) => connection.emit("Close", event);
      connection.conn.onerror = (event) => connection.emit("Error", event);
      connection.conn.onmessage = (event) => connection.handleMessage(event);

      // If already connected, manually trigger Open event
      if (connection.conn.readyState === 1) {
        connection.emit("Open", connection);
      }
    }
  }, 2000);

  // Error handler
  connection.on(AgentEvents.Error, (error) => {
    if (error.code === 'CLIENT_MESSAGE_TIMEOUT') {
      console.log("⏰ Agent session timed out");
    } else {
      console.error("❌ Agent error:", error.description || error.message);
    }
  });

  connection.on(AgentEvents.Open, () => {
    console.log("✅ Connected to Deepgram Agent");
    console.log("⚙️ Configuring agent with tags and providers...");

    const config = {
      // Agent tags for filtered searching and analytics
      tags: ["live-agent-test", "nodejs-example"],
      agent: {
        listen: {
          provider: {
            type: "deepgram",
            model: "nova-3"
          }
        },
        speak: {
          provider: {
            type: "deepgram",
            model: "aura-asteria-en"
          }
        },
        greeting: "Hello! I'm a Deepgram voice agent. How can I help you today?"
      },
    };
    connection.configure(config);
  });

  connection.on(AgentEvents.SettingsApplied, () => {
    console.log("⚙️ Agent configuration applied successfully");
    console.log("🏷️ Tags:", ["live-agent-test", "nodejs-example"]);
    console.log("🎵 Starting 15-second audio demo...");
    startAudioStream();
  });

  function startAudioStream() {
    fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        console.log("🔊 Streaming live audio to agent...");

        let isStreamActive = true;

        // Stop stream after 15 seconds
        setTimeout(() => {
          isStreamActive = false;
          res.destroy();
          console.log("⏹️ Audio stream stopped after 15 seconds");
          console.log("🎯 Agent tags demo completed successfully!");
          console.log("📊 Tags used: ['live-agent-test', 'nodejs-example']");

          // Close connection after a brief delay
          setTimeout(() => {
            connection.disconnect();
          }, 2000);
        }, 15000);

        res.on("readable", () => {
          if (!isStreamActive) return;

          const chunk = res.read();
          if (chunk) {
            connection.send(chunk);
          }
        });

        res.on("error", (error) => {
          if (isStreamActive) {
            console.error("❌ Audio stream error:", error);
          }
        });
      })
      .catch((error) => {
        console.error("❌ Failed to fetch audio stream:", error);
      });
  }

  // Agent conversation events
  connection.on(AgentEvents.ConversationText, (data) => {
    console.log(`💬 ${data.role}: ${data.content}`);
  });

  connection.on(AgentEvents.UserStartedSpeaking, () => {
    console.log("🎤 User speaking detected");
  });

  connection.on(AgentEvents.AgentThinking, () => {
    console.log("🤔 Agent processing...");
  });

  connection.on(AgentEvents.AgentStartedSpeaking, () => {
    console.log("🗨️ Agent responding");
  });

  connection.on(AgentEvents.Close, () => {
    console.log("👋 Agent session ended");
  });
};

agent();
