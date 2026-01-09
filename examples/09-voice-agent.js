/**
 * Example: Voice Agent
 *
 * Configure and use a Voice Agent for conversational AI interactions.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function voiceAgent() {
  try {
    // Create an agent connection
    const deepgramConnection = await deepgramClient.agent.v1.connect();

    // Set up event handlers before connecting
    deepgramConnection.on("open", () => {
      console.log("Connection opened");
    });

    deepgramConnection.on("message", (data) => {
      // Check message type
      if (data.type === "ConversationText") {
        console.log("Conversation text:", data);
      } else if (typeof data === "string") {
        // Audio data comes as string
        console.log("Audio received (length):", data.length);
      } else {
        console.log("Message:", data);
      }
    });

    deepgramConnection.on("error", (error) => {
      console.error("Error:", error);
    });

    let keepAliveInterval;
    deepgramConnection.on("close", () => {
      console.log("Connection closed");
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
    });

    // Connect to the websocket
    deepgramConnection.connect();

    // Wait for connection to open before configuring
    try {
      await deepgramConnection.waitForOpen();

      // Configure the agent once connection is established
      // Note: AgentV1Settings requires type: "Settings"
      deepgramConnection.sendAgentV1Settings({
        type: "Settings",
        audio: {
          input: {
            encoding: "linear16",
            sample_rate: 24000,
          },
          output: {
            encoding: "linear16",
            sample_rate: 16000,
            container: "wav",
          },
        },
        agent: {
          language: "en",
          listen: {
            provider: {
              type: "deepgram",
              model: "nova-3",
            },
          },
          think: {
            provider: {
              type: "open_ai",
              model: "gpt-4o-mini",
            },
            prompt: "You are a friendly AI assistant.",
          },
          speak: {
            provider: {
              type: "deepgram",
              model: "aura-2-thalia-en",
            },
          },
          greeting: "Hello! How can I help you today?",
        },
      });

      // Wait a moment for settings to be applied
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set up keepalive messages to keep the connection alive
      // Send keepalive every 5 seconds
      keepAliveInterval = setInterval(() => {
        if (deepgramConnection.socket.readyState === 1) { // OPEN
          deepgramConnection.sendAgentV1KeepAlive({ type: "KeepAlive" });
        } else {
          clearInterval(keepAliveInterval);
        }
      }, 5000);

      // kill websocket after 1 minute, so we can run these in CI
      setTimeout(() => {
        deepgramConnection.close();
        process.exit(0);
      }, 60000);

      // Send audio data from a file stream
      const audioStream = createReadStream("./examples/spacewalk.wav");
      audioStream.on("data", (chunk) => {
        // Send binary audio data directly to the socket
        deepgramConnection.sendAgentV1Media(chunk);
      });

      audioStream.on("end", () => {
        console.log("Finished sending audio data");
        // Keep connection open to receive agent responses
        // Keepalive will continue to be sent to maintain the connection
      });
    } catch (error) {
      console.error("Error waiting for connection:", error);
      deepgramConnection.close();
    }
  } catch (error) {
    console.error("Error setting up connection:", error);
  }
}

// Useless, need to update.
voiceAgent();
