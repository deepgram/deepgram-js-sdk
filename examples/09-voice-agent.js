/**
 * Example: Voice Agent
 *
 * Configure and use a Voice Agent for conversational AI interactions.
 */

const { createClient, AgentEvents } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

function voiceAgent() {
  // Create an agent connection
  const deepgramConnection = deepgramClient.agent();

  // Set up event handlers
  deepgramConnection.on(AgentEvents.Open, () => {
    console.log("Connection opened");

    // Set up event handlers
    deepgramConnection.on(AgentEvents.ConversationText, (data) => {
      console.log("Conversation text:", data);
    });

    deepgramConnection.on(AgentEvents.Audio, (data) => {
      console.log("Audio received:", data);
    });

    deepgramConnection.on(AgentEvents.Error, (error) => {
      console.error("Error:", error);
    });

    deepgramConnection.on(AgentEvents.Close, () => {
      console.log("Connection closed");
    });

    // Configure the agent once connection is established
    deepgramConnection.configure({
      // agent configuration options
      // See API reference for available options
    });

    // Send audio data
    // deepgramConnection.send(audioData);
  });
}

// Uncomment to run:
voiceAgent();
