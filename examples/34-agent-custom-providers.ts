/**
 * Example 34: Voice Agent with Custom Providers
 *
 * This example demonstrates how to configure Voice Agents with different
 * third-party providers for thinking (LLM) and speaking (TTS).
 *
 * Available Providers:
 * - Think: OpenAI, Anthropic (Claude), Google AI, Groq, AWS Bedrock
 * - Speak: Deepgram Aura, ElevenLabs, Cartesia, OpenAI TTS, AWS Polly
 * - Listen: Deepgram (Nova, Whisper, etc.)
 *
 * Note: External providers require their own API keys to be configured.
 * This example shows the configuration structure but won't run without proper credentials.
 */

import { DeepgramClient } from "../src/CustomClient.js";

const deepgramClient = new DeepgramClient({
	apiKey: process.env.DEEPGRAM_API_KEY ?? "",
});

/**
 * Example 1: OpenAI for Thinking + Deepgram for Speaking (Default)
 *
 * Most common configuration - uses OpenAI's GPT models for conversation
 * and Deepgram's Aura for natural-sounding speech synthesis.
 */
async function exampleOpenAiDeepgram(): Promise<void> {
	console.log("\n=== Example 1: OpenAI + Deepgram ===\n");

	try {
		const connection = await deepgramClient.agent.v1.createConnection();

		connection.on("open", () => {
			console.log("✓ Connection opened");

			// Configure agent with OpenAI thinking + Deepgram speaking
			connection.sendSettings({
				type: "Settings",
				audio: {
					input: { encoding: "linear16", sample_rate: 24_000 },
					output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
				},
				agent: {
					language: "en",
					listen: {
						provider: { type: "deepgram", model: "nova-3" },
					},
					think: {
						provider: {
							type: "open_ai",
							model: "gpt-4o-mini",
							// Optional: Add OpenAI-specific settings
							// api_key: process.env.OPENAI_API_KEY, // If different from Deepgram's integration
						},
						prompt: "You are a helpful AI assistant.",
					},
					speak: {
						provider: {
							type: "deepgram",
							model: "aura-2-thalia-en",
						},
					},
				},
			});
		});

		connection.on("error", (error) => {
			console.error("✗ Connection error:", error);
		});

		connection.on("close", () => {
			console.log("Connection closed");
		});

		connection.connect();

		// Note: In a real application, you would send audio and handle responses
		// For this example, we'll just demonstrate the configuration

		setTimeout(() => {
			connection.close();
		}, 2000);
	} catch (error) {
		console.error("Error:", error);
	}
}

/**
 * Example 2: Anthropic (Claude) for Thinking + ElevenLabs for Speaking
 *
 * Premium configuration - Claude provides sophisticated reasoning,
 * ElevenLabs delivers high-quality voice synthesis.
 *
 * Requirements:
 * - Anthropic API key configured in Deepgram account
 * - ElevenLabs API key configured in Deepgram account
 */
async function exampleAnthropicElevenLabs(): Promise<void> {
	console.log("\n=== Example 2: Anthropic (Claude) + ElevenLabs ===\n");
	console.log("Configuration structure (requires external API keys):\n");

	// This is the configuration structure - it won't work without proper credentials
	const configurationExample = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
		},
		agent: {
			language: "en",
			listen: {
				provider: { type: "deepgram", model: "nova-3" },
			},
			think: {
				provider: {
					type: "anthropic",
					model: "claude-3-5-sonnet-20241022",
					// Optional Anthropic-specific settings:
					// api_key: process.env.ANTHROPIC_API_KEY,
					// max_tokens: 1024,
				},
				prompt: "You are Claude, a thoughtful and articulate AI assistant.",
			},
			speak: {
				provider: {
					type: "eleven_labs",
					model: "eleven_turbo_v2_5",
					// Optional ElevenLabs-specific settings:
					// api_key: process.env.ELEVENLABS_API_KEY,
					// voice_id: "your_voice_id",
					// stability: 0.5,
					// similarity_boost: 0.75,
				},
			},
		},
	};

	console.log(JSON.stringify(configurationExample, null, 2));
	console.log("\nNote: This configuration requires:");
	console.log("  • Anthropic API key for Claude models");
	console.log("  • ElevenLabs API key for voice synthesis");
}

/**
 * Example 3: Google AI for Thinking + Cartesia for Speaking
 *
 * Fast and cost-effective - Google's Gemini models with Cartesia's
 * real-time voice synthesis.
 */
async function exampleGoogleCartesia(): Promise<void> {
	console.log("\n=== Example 3: Google AI (Gemini) + Cartesia ===\n");
	console.log("Configuration structure (requires external API keys):\n");

	const configurationExample = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
		},
		agent: {
			language: "en",
			listen: {
				provider: { type: "deepgram", model: "nova-3" },
			},
			think: {
				provider: {
					type: "google",
					model: "gemini-pro",
					// Optional Google AI-specific settings:
					// api_key: process.env.GOOGLE_AI_API_KEY,
				},
				prompt: "You are a knowledgeable AI assistant powered by Google AI.",
			},
			speak: {
				provider: {
					type: "cartesia",
					model: "sonic-english",
					// Optional Cartesia-specific settings:
					// api_key: process.env.CARTESIA_API_KEY,
					// voice_id: "your_voice_id",
				},
			},
		},
	};

	console.log(JSON.stringify(configurationExample, null, 2));
}

/**
 * Example 4: Groq for Thinking + OpenAI TTS for Speaking
 *
 * Ultra-fast inference - Groq's LPU acceleration with OpenAI's
 * text-to-speech models.
 */
async function exampleGroqOpenAiTts(): Promise<void> {
	console.log("\n=== Example 4: Groq + OpenAI TTS ===\n");
	console.log("Configuration structure (requires external API keys):\n");

	const configurationExample = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
		},
		agent: {
			language: "en",
			listen: {
				provider: { type: "deepgram", model: "nova-3" },
			},
			think: {
				provider: {
					type: "groq",
					model: "llama-3.1-70b-versatile",
					// Optional Groq-specific settings:
					// api_key: process.env.GROQ_API_KEY,
				},
				prompt: "You are a fast and efficient AI assistant.",
			},
			speak: {
				provider: {
					type: "open_ai",
					model: "tts-1",
					// Optional OpenAI TTS-specific settings:
					// api_key: process.env.OPENAI_API_KEY,
					// voice: "alloy",
					// speed: 1.0,
				},
			},
		},
	};

	console.log(JSON.stringify(configurationExample, null, 2));
}

/**
 * Example 5: AWS Bedrock for Thinking + AWS Polly for Speaking
 *
 * AWS-native solution - Use AWS Bedrock's foundational models
 * with AWS Polly's neural voices.
 */
async function exampleAwsBedrockPolly(): Promise<void> {
	console.log("\n=== Example 5: AWS Bedrock + AWS Polly ===\n");
	console.log("Configuration structure (requires AWS credentials):\n");

	const configurationExample = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
		},
		agent: {
			language: "en",
			listen: {
				provider: { type: "deepgram", model: "nova-3" },
			},
			think: {
				provider: {
					type: "aws_bedrock",
					model: "anthropic.claude-3-sonnet-20240229-v1:0",
					// Optional AWS Bedrock-specific settings:
					// region: "us-east-1",
					// access_key_id: process.env.AWS_ACCESS_KEY_ID,
					// secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
				},
				prompt: "You are a professional AI assistant.",
			},
			speak: {
				provider: {
					type: "aws_polly",
					model: "neural",
					// Optional AWS Polly-specific settings:
					// region: "us-east-1",
					// voice_id: "Joanna",
					// engine: "neural",
				},
			},
		},
	};

	console.log(JSON.stringify(configurationExample, null, 2));
}

/**
 * Provider Selection Guide
 */
function providerSelectionGuide(): void {
	console.log("\n=== Provider Selection Guide ===\n");

	console.log("THINKING PROVIDERS:\n");

	console.log("OpenAI (GPT-4, GPT-4o-mini):");
	console.log("  ✓ Best for: General-purpose conversations");
	console.log("  ✓ Strengths: Well-rounded, reliable, widely supported");
	console.log("  ✓ Cost: Moderate\n");

	console.log("Anthropic (Claude 3.5 Sonnet, Opus):");
	console.log("  ✓ Best for: Complex reasoning, nuanced conversations");
	console.log("  ✓ Strengths: Thoughtful responses, strong instruction following");
	console.log("  ✓ Cost: Moderate to High\n");

	console.log("Google AI (Gemini Pro):");
	console.log("  ✓ Best for: Fast responses, cost optimization");
	console.log("  ✓ Strengths: Quick inference, good multimodal support");
	console.log("  ✓ Cost: Low to Moderate\n");

	console.log("Groq (Llama 3.1, Mixtral):");
	console.log("  ✓ Best for: Ultra-low latency, real-time interactions");
	console.log("  ✓ Strengths: Blazing fast inference with LPU acceleration");
	console.log("  ✓ Cost: Low\n");

	console.log("AWS Bedrock (Multiple models):");
	console.log("  ✓ Best for: Enterprise AWS environments");
	console.log("  ✓ Strengths: AWS-native, compliance, multiple model choices");
	console.log("  ✓ Cost: Varies by model\n");

	console.log("\nSPEAKING PROVIDERS:\n");

	console.log("Deepgram Aura:");
	console.log("  ✓ Best for: Natural-sounding, low-latency speech");
	console.log("  ✓ Strengths: Integrated, optimized for real-time");
	console.log("  ✓ Cost: Included with Deepgram\n");

	console.log("ElevenLabs:");
	console.log("  ✓ Best for: Premium voice quality, voice cloning");
	console.log("  ✓ Strengths: Most natural-sounding, extensive voice library");
	console.log("  ✓ Cost: High\n");

	console.log("Cartesia:");
	console.log("  ✓ Best for: Fast streaming, expressive voices");
	console.log("  ✓ Strengths: Low latency, emotion control");
	console.log("  ✓ Cost: Moderate\n");

	console.log("OpenAI TTS:");
	console.log("  ✓ Best for: OpenAI ecosystem integration");
	console.log("  ✓ Strengths: Multiple voices, reliable");
	console.log("  ✓ Cost: Moderate\n");

	console.log("AWS Polly:");
	console.log("  ✓ Best for: AWS environments, neural voices");
	console.log("  ✓ Strengths: AWS-native, good quality");
	console.log("  ✓ Cost: Low to Moderate\n");
}

// Main execution
async function main(): Promise<void> {
	console.log("=== Voice Agent Custom Providers Example ===");
	console.log(
		"\nThis example demonstrates different provider configurations for Voice Agents."
	);
	console.log("Note: External providers require API keys configured in your Deepgram account.\n");

	// Example 1 can actually run (uses OpenAI via Deepgram)
	await exampleOpenAiDeepgram();

	// Examples 2-5 show configuration structures
	await exampleAnthropicElevenLabs();
	await exampleGoogleCartesia();
	await exampleGroqOpenAiTts();
	await exampleAwsBedrockPolly();

	// Show provider selection guide
	providerSelectionGuide();

	console.log("\n=== Configuration Notes ===\n");
	console.log("To use external providers:");
	console.log("1. Configure API keys in your Deepgram account dashboard");
	console.log("2. Some providers may require additional setup/approval");
	console.log("3. Check provider availability in your region");
	console.log("4. Monitor costs - external providers bill separately");
	console.log(
		"5. Test with small conversations before production deployment\n"
	);
}

main();
