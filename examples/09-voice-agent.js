/**
 * Example: Voice Agent
 *
 * Configure and use a Voice Agent for conversational AI interactions.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function voiceAgent() {
  // Create an agent connection
  const deepgramConnection = await deepgramClient.agent.v1.connect();

  // Set up event handlers
  deepgramConnection.on("open", () => {
    console.log("Connection opened");

    // Set up event handlers
    deepgramConnection.on("message", (data) => {
      // Check message type
      if (data.type === "ConversationText") {
        console.log("Conversation text:", data);
      } else if (typeof data === "string") {
        // Audio data comes as string
        console.log("Audio received:", data);
      }
    });

    deepgramConnection.on("error", (error) => {
      console.error("Error:", error);
    });

    deepgramConnection.on("close", () => {
      console.log("Connection closed");
    });

    // Configure the agent once connection is established
    deepgramConnection.sendAgentV1Settings({
      // agent configuration options
      // See API reference for available options
    });

    // Send audio data
    // deepgramConnection.sendAgentV1Media(audioData);
  });

  deepgramConnection.connect();
}

// Useless, need to update.
voiceAgent();
