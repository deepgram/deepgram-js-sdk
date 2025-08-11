/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

console.log("🔑 API Key loaded successfully");

// Mock weather API function
const getWeatherData = async (location, unit = "fahrenheit") => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock weather data based on location
  const weatherData = {
    "New York": { temperature: 72, condition: "sunny", humidity: 45 },
    "London": { temperature: 16, condition: "cloudy", humidity: 80 },
    "Tokyo": { temperature: 28, condition: "partly cloudy", humidity: 65 },
    "default": { temperature: 20, condition: "mild", humidity: 60 }
  };

  const data = weatherData[location] || weatherData.default;

  return {
    location,
    temperature: unit === "celsius" ? Math.round((data.temperature - 32) * 5 / 9) : data.temperature,
    unit: unit === "celsius" ? "°C" : "°F",
    condition: data.condition,
    humidity: data.humidity
  };
};

const agent = async () => {
  // Checks for API key
  if (!process.env.DEEPGRAM_API_KEY) {
    console.error("❌ Error: DEEPGRAM_API_KEY environment variable is required");
    console.log("💡 Run with: DEEPGRAM_API_KEY=your_api_key_here npm start");
    process.exit(1);
  }

  console.log("🚀 Starting Deepgram Agent Live with History example...");
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  console.log("📞 Connecting to Deepgram Agent API...");
  const connection = deepgram.agent();

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
    console.log("⚙️ Configuring agent with history and function calling...");

    // Previous conversation history for context
    const conversationHistory = [
      {
        type: "History",
        role: "user",
        content: "Hi there! Can you help me with weather information?"
      },
      {
        type: "History",
        role: "assistant",
        content: "Hello! I'd be happy to help you with weather information. I can check current weather conditions for any location you'd like to know about."
      },
      {
        type: "History",
        role: "user",
        content: "What's the weather like in San Francisco right now?"
      },
      {
        type: "History",
        function_calls: [
          {
            id: "fc_weather_example_123",
            name: "get_weather",
            client_side: true,
            arguments: '{"location": "San Francisco", "unit": "fahrenheit"}',
            response: '{"location": "San Francisco", "temperature": 65, "unit": "°F", "condition": "foggy", "humidity": 75}'
          }
        ]
      },
      {
        type: "History",
        role: "assistant",
        content: "Based on the latest data, San Francisco is currently 65°F with foggy conditions and 75% humidity. It's a typical San Francisco day!"
      },
      {
        type: "History",
        role: "user",
        content: "Great! How about New York?"
      }
    ];

    const config = {
      // Enable history feature for conversation context
      flags: {
        history: true
      },
      // Agent tags for analytics
      tags: ["history-example", "function-calling", "weather-demo"],
      audio: {
        input: {
          encoding: "linear16",
          sample_rate: 16000
        }
      },
      agent: {
        language: "en",
        // Provide conversation context/history
        context: {
          messages: conversationHistory
        },
        listen: {
          provider: {
            type: "deepgram",
            model: "nova-2"
          }
        },
        speak: {
          provider: {
            type: "deepgram",
            model: "aura-asteria-en"
          }
        },
        // Configure the thinking/LLM provider with function calling
        think: {
          provider: {
            type: "open_ai",
            model: "gpt-4o-mini"
          },
          // Define available functions using OpenAPI-like schema
          functions: [
            {
              name: "get_weather",
              description: "Get the current weather conditions for a specific location",
              parameters: {
                type: "object",
                properties: {
                  location: {
                    type: "string",
                    description: "The city or location to get weather for (e.g., 'New York', 'London', 'Tokyo')"
                  },
                  unit: {
                    type: "string",
                    enum: ["fahrenheit", "celsius"],
                    description: "Temperature unit preference",
                    default: "fahrenheit"
                  }
                },
                required: ["location"]
              }
            }
          ],
          prompt: "You are a helpful weather assistant with access to current weather data. Use the get_weather function to provide accurate, up-to-date weather information when users ask about weather conditions. Always be conversational and provide context about the weather conditions."
        },
        greeting: "Hello! I'm your weather assistant with access to current weather data. I remember our previous conversations and can help you with weather information for any location. What would you like to know?"
      }
    };

    connection.configure(config);
  });

  connection.on(AgentEvents.SettingsApplied, () => {
    console.log("⚙️ Agent configuration applied successfully");
    console.log("📚 History enabled with previous conversation context");
    console.log("🔧 Function calling configured for weather data");
    console.log("🎵 Starting 20-second audio demo...");

    // Inject a user message to potentially trigger a function call
    setTimeout(() => {
      console.log("💬 Injecting user message to test function calling...");
      connection.send(JSON.stringify({
        type: "InjectUserMessage",
        content: "Can you check the weather in New York for me?"
      }));
    }, 5000); // Wait 5 seconds after settings are applied

    startAudioStream();
  });

  // Handle function call requests from the agent
  connection.on(AgentEvents.FunctionCallRequest, async (data) => {
    console.log("📞 Function call request received:", data);

    // Process each function call in the request
    for (const func of data.functions) {
      console.log(`🔄 Processing function: ${func.name} with args: ${func.arguments}`);

      if (func.name === "get_weather") {
        try {
          const args = JSON.parse(func.arguments);
          console.log(`🌤️ Fetching weather for ${args.location}...`);

          const weatherResult = await getWeatherData(args.location, args.unit);

          console.log(`✅ Weather data retrieved:`, weatherResult);

          // Send function call response back to agent
          connection.functionCallResponse({
            id: func.id,
            name: func.name,
            content: JSON.stringify(weatherResult)
          });

          console.log(`📤 Function response sent for call ID: ${func.id}`);

        } catch (error) {
          console.error(`❌ Error processing weather function:`, error);

          // Send error response
          connection.functionCallResponse({
            id: func.id,
            name: func.name,
            content: JSON.stringify({
              error: "Failed to retrieve weather data",
              message: error.message
            })
          });
        }
      } else {
        console.log(`⚠️ Unknown function called: ${func.name}`);

        connection.functionCallResponse({
          id: func.id,
          name: func.name,
          content: JSON.stringify({
            error: "Function not found",
            message: `Function '${func.name}' is not available`
          })
        });
      }
    }
  });

  function startAudioStream() {
    fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        console.log("🔊 Streaming live audio to agent...");

        let isStreamActive = true;

        // Stop stream after 20 seconds
        setTimeout(() => {
          isStreamActive = false;
          res.destroy();
          console.log("⏹️ Audio stream stopped after 20 seconds");
          console.log("🎯 Agent history and function calling demo completed!");
          console.log("📊 Features demonstrated:");
          console.log("  • Conversation history preservation");
          console.log("  • Function call integration");
          console.log("  • Context-aware responses");

          // Close connection after a brief delay
          setTimeout(() => {
            connection.disconnect();
          }, 3000);
        }, 20000);

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

  connection.on(AgentEvents.AgentThinking, (data) => {
    console.log("🤔 Agent processing...", data.content ? `(${data.content})` : "");
  });

  connection.on(AgentEvents.AgentStartedSpeaking, (data) => {
    console.log("🗨️ Agent responding", data ? `(latency: ${data.total_latency}ms)` : "");
  });

  connection.on(AgentEvents.AgentAudioDone, () => {
    console.log("✅ Agent finished speaking");
  });

  connection.on(AgentEvents.Close, () => {
    console.log("👋 Agent session ended");
  });

  // Handle history events to show conversation context in payload
  connection.on(AgentEvents.History, (data) => {
    if (data.function_calls && data.function_calls.length > 0) {
      // Function call history payload
      console.log("📚 Function Call History payload received:", {
        type: data.type,
        function_calls: data.function_calls
      });
    } else if (data.role && data.content) {
      // Conversation history payload
      console.log("📚 Conversation History payload received:", {
        type: data.type,
        role: data.role,
        content: data.content
      });
    } else {
      // Fallback for any other history format
      console.log("📚 History payload received:", data);
    }
  });

  // Handle any unhandled events for debugging
  connection.on(AgentEvents.Unhandled, (data) => {
    console.log("🔍 Unhandled event:", data);
  });
};

agent().catch(error => {
  console.error("💥 Application error:", error);
  process.exit(1);
});
