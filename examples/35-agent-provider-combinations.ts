/**
 * Example 35: Voice Agent Provider Combinations & Best Practices
 *
 * This example shows practical combinations of providers for different use cases,
 * with performance and cost considerations.
 *
 * Use Cases:
 * - High-quality customer service
 * - Fast interactive applications
 * - Cost-optimized solutions
 * - Enterprise deployments
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
	apiKey: process.env.DEEPGRAM_API_KEY ?? "",
});

/**
 * Use Case 1: Premium Customer Service
 *
 * Priority: Quality > Cost
 * Scenario: High-value customer interactions where quality matters most
 *
 * Configuration:
 * - Think: Anthropic Claude (sophisticated reasoning)
 * - Speak: ElevenLabs (premium voice quality)
 * - Listen: Deepgram Nova-3 (best accuracy)
 */
function premiumCustomerService(): void {
	console.log("\n=== Use Case 1: Premium Customer Service ===\n");

	const configuration = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 24_000, container: "wav" },
		},
		agent: {
			language: "en",
			listen: {
				provider: {
					type: "deepgram",
					model: "nova-3", // Best accuracy for customer service
				},
			},
			think: {
				provider: {
					type: "anthropic",
					model: "claude-3-5-sonnet-20241022", // Sophisticated reasoning
				},
				prompt:
					"You are a premium customer service agent. Be professional, empathetic, and thorough. Always prioritize customer satisfaction.",
			},
			speak: {
				provider: {
					type: "eleven_labs",
					model: "eleven_turbo_v2_5", // Premium voice quality
					// voice_id: "professional_voice_id", // Select appropriate voice
				},
			},
		},
	};

	console.log("Configuration:");
	console.log(JSON.stringify(configuration, null, 2));
	console.log("\nExpected Performance:");
	console.log("  • Latency: ~800ms - 1.5s first response");
	console.log("  • Quality: ★★★★★ (5/5)");
	console.log("  • Cost: $$$ (High)");
	console.log("  • Best for: Enterprise customer service, VIP support");
}

/**
 * Use Case 2: Fast Interactive Application
 *
 * Priority: Speed > Cost
 * Scenario: Real-time interactions where latency is critical
 *
 * Configuration:
 * - Think: Groq (ultra-fast LPU inference)
 * - Speak: Cartesia (low-latency streaming)
 * - Listen: Deepgram Nova-3 (optimized for real-time)
 */
function fastInteractive(): void {
	console.log("\n=== Use Case 2: Fast Interactive Application ===\n");

	const configuration = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
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
					type: "groq",
					model: "llama-3.1-70b-versatile", // Ultra-fast inference
				},
				prompt:
					"You are a quick and helpful assistant. Provide concise, accurate responses.",
			},
			speak: {
				provider: {
					type: "cartesia",
					model: "sonic-english", // Fast streaming TTS
				},
			},
		},
	};

	console.log("Configuration:");
	console.log(JSON.stringify(configuration, null, 2));
	console.log("\nExpected Performance:");
	console.log("  • Latency: ~300ms - 600ms first response");
	console.log("  • Quality: ★★★★☆ (4/5)");
	console.log("  • Cost: $$ (Moderate)");
	console.log("  • Best for: Gaming, live events, real-time demos");
}

/**
 * Use Case 3: Cost-Optimized Solution
 *
 * Priority: Cost > Features
 * Scenario: High-volume applications where cost efficiency is critical
 *
 * Configuration:
 * - Think: Google Gemini (cost-effective)
 * - Speak: Deepgram Aura (included with Deepgram)
 * - Listen: Deepgram Nova-3 (cost-effective)
 */
function costOptimized(): void {
	console.log("\n=== Use Case 3: Cost-Optimized Solution ===\n");

	const configuration = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
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
					type: "google",
					model: "gemini-pro", // Cost-effective LLM
				},
				prompt: "You are a helpful assistant. Be clear and concise.",
			},
			speak: {
				provider: {
					type: "deepgram",
					model: "aura-2-thalia-en", // Included with Deepgram
				},
			},
		},
	};

	console.log("Configuration:");
	console.log(JSON.stringify(configuration, null, 2));
	console.log("\nExpected Performance:");
	console.log("  • Latency: ~500ms - 900ms first response");
	console.log("  • Quality: ★★★☆☆ (3/5)");
	console.log("  • Cost: $ (Low)");
	console.log("  • Best for: High-volume apps, internal tools, prototypes");
}

/**
 * Use Case 4: Balanced Production Setup
 *
 * Priority: Quality = Speed = Cost (Balanced)
 * Scenario: General production applications with balanced requirements
 *
 * Configuration:
 * - Think: OpenAI GPT-4o-mini (balanced quality/speed/cost)
 * - Speak: Deepgram Aura (good quality, included)
 * - Listen: Deepgram Nova-3 (balanced accuracy/speed)
 */
function balancedProduction(): void {
	console.log("\n=== Use Case 4: Balanced Production Setup ===\n");

	const configuration = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
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
					model: "gpt-4o-mini", // Balanced quality/speed/cost
				},
				prompt:
					"You are a helpful and professional AI assistant. Provide accurate and friendly responses.",
			},
			speak: {
				provider: {
					type: "deepgram",
					model: "aura-2-thalia-en",
				},
			},
		},
	};

	console.log("Configuration:");
	console.log(JSON.stringify(configuration, null, 2));
	console.log("\nExpected Performance:");
	console.log("  • Latency: ~600ms - 1s first response");
	console.log("  • Quality: ★★★★☆ (4/5)");
	console.log("  • Cost: $$ (Moderate)");
	console.log("  • Best for: Most production applications, general use");
}

/**
 * Use Case 5: Enterprise AWS Deployment
 *
 * Priority: Compliance & Integration
 * Scenario: Enterprise with AWS infrastructure and compliance requirements
 *
 * Configuration:
 * - Think: AWS Bedrock (compliance, AWS-native)
 * - Speak: AWS Polly (AWS-native)
 * - Listen: Deepgram Nova-3 (best accuracy)
 */
function enterpriseAws(): void {
	console.log("\n=== Use Case 5: Enterprise AWS Deployment ===\n");

	const configuration = {
		type: "Settings",
		audio: {
			input: { encoding: "linear16", sample_rate: 24_000 },
			output: { encoding: "linear16", sample_rate: 16_000, container: "wav" },
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
					type: "aws_bedrock",
					model: "anthropic.claude-3-sonnet-20240229-v1:0", // AWS Bedrock Claude
					// region: "us-east-1",
				},
				prompt: "You are a professional enterprise AI assistant.",
			},
			speak: {
				provider: {
					type: "aws_polly",
					model: "neural",
					// region: "us-east-1",
					// voice_id: "Joanna",
				},
			},
		},
	};

	console.log("Configuration:");
	console.log(JSON.stringify(configuration, null, 2));
	console.log("\nExpected Performance:");
	console.log("  • Latency: ~700ms - 1.2s first response");
	console.log("  • Quality: ★★★★☆ (4/5)");
	console.log("  • Cost: $$ (Moderate)");
	console.log(
		"  • Best for: Enterprise AWS deployments, compliance requirements"
	);
	console.log("\nAdditional Benefits:");
	console.log("  • AWS PrivateLink support");
	console.log("  • VPC integration");
	console.log("  • AWS IAM authentication");
	console.log("  • Unified AWS billing");
}

/**
 * Performance Comparison Table
 */
function performanceComparison(): void {
	console.log("\n=== Performance Comparison ===\n");

	console.log("┌─────────────────────────┬──────────┬─────────┬──────┐");
	console.log("│ Use Case                │ Latency  │ Quality │ Cost │");
	console.log("├─────────────────────────┼──────────┼─────────┼──────┤");
	console.log("│ Premium Customer Service│ ~1.2s    │ ★★★★★   │ $$$  │");
	console.log("│ Fast Interactive        │ ~0.5s    │ ★★★★☆   │ $$   │");
	console.log("│ Cost-Optimized          │ ~0.7s    │ ★★★☆☆   │ $    │");
	console.log("│ Balanced Production     │ ~0.8s    │ ★★★★☆   │ $$   │");
	console.log("│ Enterprise AWS          │ ~1.0s    │ ★★★★☆   │ $$   │");
	console.log("└─────────────────────────┴──────────┴─────────┴──────┘");
}

/**
 * Best Practices
 */
function bestPractices(): void {
	console.log("\n=== Best Practices ===\n");

	console.log("1. Provider Selection:\n");
	console.log("   • Start with balanced defaults (OpenAI + Deepgram)");
	console.log("   • Optimize based on actual usage patterns");
	console.log("   • Test multiple providers with your specific use case");
	console.log("   • Consider regional availability\n");

	console.log("2. Cost Optimization:\n");
	console.log("   • Use cost-effective models for high-volume scenarios");
	console.log("   • Implement caching for common responses");
	console.log("   • Monitor usage and set budget alerts");
	console.log("   • Consider provider pricing tiers\n");

	console.log("3. Performance Optimization:\n");
	console.log("   • Choose geographically close providers");
	console.log("   • Use streaming where supported");
	console.log("   • Implement connection pooling");
	console.log("   • Monitor and optimize prompt length\n");

	console.log("4. Quality Assurance:\n");
	console.log("   • Test with real user audio samples");
	console.log("   • Collect user feedback on voice quality");
	console.log("   • A/B test different provider combinations");
	console.log("   • Monitor conversation success rates\n");

	console.log("5. Production Readiness:\n");
	console.log("   • Set up monitoring and alerting");
	console.log("   • Implement fallback providers");
	console.log("   • Plan for provider API changes");
	console.log("   • Document provider-specific quirks");
	console.log("   • Test disaster recovery scenarios\n");
}

/**
 * Common Pitfalls to Avoid
 */
function commonPitfalls(): void {
	console.log("\n=== Common Pitfalls to Avoid ===\n");

	console.log("❌ Using premium providers for all use cases");
	console.log("   → Start with balanced options, upgrade selectively\n");

	console.log("❌ Not testing latency in production environment");
	console.log("   → Network conditions affect real-world performance\n");

	console.log("❌ Ignoring provider rate limits");
	console.log("   → Implement proper rate limiting and queuing\n");

	console.log("❌ Mixing incompatible audio formats");
	console.log("   → Ensure consistent sample rates and encodings\n");

	console.log("❌ Not monitoring costs across providers");
	console.log("   → Set up unified cost tracking and alerts\n");

	console.log("❌ Hardcoding provider configurations");
	console.log("   → Use environment-based configuration\n");
}

// Main execution
function main(): void {
	console.log("=== Voice Agent Provider Combinations ===");
	console.log("\nPractical provider combinations for different use cases.\n");

	premiumCustomerService();
	fastInteractive();
	costOptimized();
	balancedProduction();
	enterpriseAws();

	performanceComparison();
	bestPractices();
	commonPitfalls();

	console.log("\n=== Summary ===\n");
	console.log("Choose your provider combination based on:");
	console.log("  • Primary priority (quality vs speed vs cost)");
	console.log("  • Expected conversation volume");
	console.log("  • Compliance requirements");
	console.log("  • Existing infrastructure (AWS, etc.)");
	console.log("  • Geographic distribution of users\n");

	console.log("Remember: You can always start with balanced defaults");
	console.log(
		"and optimize based on real-world usage patterns!\n"
	);
}

main();
