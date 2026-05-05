/**
 * Example: Voice Agent - Injecting Messages
 *
 * Demonstrates how to inject messages into an active Voice Agent session.
 *
 * There are two injection methods with different field names:
 *
 * - sendInjectAgentMessage({ type: "InjectAgentMessage", message: "..." })
 *   The agent speaks this exact text, bypassing the LLM. Field: `message`.
 *
 * - sendInjectUserMessage({ type: "InjectUserMessage", content: "..." })
 *   Simulates the user saying something; the agent responds via the LLM. Field: `content`.
 *
 * A common mistake is swapping the field names — using `content` for InjectAgentMessage
 * or `message` for InjectUserMessage. Using the SDK methods avoids this because
 * TypeScript enforces the correct shape at compile time.
 *
 * The API will emit an InjectionRefused event if injection is attempted whilst
 * the agent is already speaking. Wait for AgentAudioDone before retrying.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function agentInjectMessage() {
  try {
    const deepgramConnection = await deepgramClient.agent.v1.createConnection();

    deepgramConnection.on("open", () => {
      console.log("Connection opened");
    });

    deepgramConnection.on("message", (data) => {
      if (data.type === "SettingsApplied") {
        console.log("Settings applied — injecting agent message...");

        // sendInjectAgentMessage: the agent speaks this exact text (no LLM involved).
        // The field MUST be `message`, not `content`.
        deepgramConnection.sendInjectAgentMessage({
          type: "InjectAgentMessage",
          message: "Are you still there? Let me know if I can help!",
        });

        // After a delay, inject a simulated user utterance so the agent replies via LLM.
        setTimeout(() => {
          console.log("Injecting simulated user message...");

          // sendInjectUserMessage: simulates the user saying something.
          // The field MUST be `content`, not `message`.
          deepgramConnection.sendInjectUserMessage({
            type: "InjectUserMessage",
            content: "What can you help me with today?",
          });
        }, 5000);
      } else if (data.type === "ConversationText") {
        const role = data.role === "assistant" ? "Agent" : "User";
        console.log(`${role}: ${data.content}`);
      } else if (data.type === "InjectionRefused") {
        // The API refuses injection if the agent is currently speaking.
        // Wait for AgentAudioDone before retrying.
        console.warn("Injection refused:", data.message);
      } else if (data.type === "AgentStartedSpeaking") {
        console.log("Agent started speaking");
      } else if (data.type === "AgentAudioDone") {
        console.log("Agent finished speaking");
      } else if (data instanceof Uint8Array || Buffer.isBuffer(data)) {
        console.log("Audio data received");
      } else {
        console.log("Message:", data);
      }
    });

    deepgramConnection.on("error", (error) => {
      console.error("Error:", error);
    });

    let keepAliveInterval: ReturnType<typeof setInterval> | undefined;
    deepgramConnection.on("close", () => {
      console.log("Connection closed");
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
    });

    deepgramConnection.connect();

    try {
      await deepgramConnection.waitForOpen();

      deepgramConnection.sendSettings({
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
        },
      });

      keepAliveInterval = setInterval(() => {
        if (deepgramConnection.socket.readyState === 1) {
          deepgramConnection.sendKeepAlive({ type: "KeepAlive" });
        } else {
          clearInterval(keepAliveInterval);
        }
      }, 5000);

      // Kill websocket after 30 seconds so the example can exit in CI.
      setTimeout(() => {
        deepgramConnection.close();
        process.exit(0);
      }, 30000);

      const audioStream = createReadStream("./examples/spacewalk.wav");
      audioStream.on("data", (chunk) => {
        deepgramConnection.sendMedia(chunk);
      });
      audioStream.on("end", () => {
        console.log("Finished sending audio");
      });
    } catch (error) {
      console.error("Error waiting for connection:", error);
      deepgramConnection.close();
    }
  } catch (error) {
    console.error("Error setting up connection:", error);
  }
}

(async () => {
  await agentInjectMessage();
})();
