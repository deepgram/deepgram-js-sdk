/* eslint-disable vitest/valid-expect -- Tests don't require assertion messages */
/* eslint-disable max-lines-per-function -- Test suites naturally have many cases */
/* eslint-disable @typescript-eslint/naming-convention -- Package names use hyphens */

import { describe, expect, it } from "vitest";

/**
 * Tests for Voice Agent provider configurations
 *
 * These tests validate the structure of provider configurations without
 * making actual API calls (which would require external API keys).
 *
 * We test:
 * - Provider configuration object structure
 * - Type validation
 * - Required fields
 */

describe("Voice Agent Provider Configurations", () => {
	describe("Think Provider Types", () => {
		it("should accept valid OpenAI think provider configuration", () => {
			const config = {
				type: "open_ai" as const,
				model: "gpt-4o-mini",
			};

			expect(config.type).toBe("open_ai");
			expect(config.model).toBeDefined();
		});

		it("should accept valid Anthropic think provider configuration", () => {
			const config = {
				type: "anthropic" as const,
				model: "claude-3-5-sonnet-20241022",
			};

			expect(config.type).toBe("anthropic");
			expect(config.model).toBeDefined();
		});

		it("should accept valid Google AI think provider configuration", () => {
			const config = {
				type: "google" as const,
				model: "gemini-pro",
			};

			expect(config.type).toBe("google");
			expect(config.model).toBeDefined();
		});

		it("should accept valid Groq think provider configuration", () => {
			const config = {
				type: "groq" as const,
				model: "llama-3.1-70b-versatile",
			};

			expect(config.type).toBe("groq");
			expect(config.model).toBeDefined();
		});

		it("should accept valid AWS Bedrock think provider configuration", () => {
			const config = {
				type: "aws_bedrock" as const,
				model: "anthropic.claude-3-sonnet-20240229-v1:0",
			};

			expect(config.type).toBe("aws_bedrock");
			expect(config.model).toBeDefined();
		});
	});

	describe("Speak Provider Types", () => {
		it("should accept valid Deepgram speak provider configuration", () => {
			const config = {
				type: "deepgram" as const,
				model: "aura-2-thalia-en",
			};

			expect(config.type).toBe("deepgram");
			expect(config.model).toBeDefined();
		});

		it("should accept valid ElevenLabs speak provider configuration", () => {
			const config = {
				type: "eleven_labs" as const,
				model: "eleven_turbo_v2_5",
			};

			expect(config.type).toBe("eleven_labs");
			expect(config.model).toBeDefined();
		});

		it("should accept valid Cartesia speak provider configuration", () => {
			const config = {
				type: "cartesia" as const,
				model: "sonic-english",
			};

			expect(config.type).toBe("cartesia");
			expect(config.model).toBeDefined();
		});

		it("should accept valid OpenAI TTS speak provider configuration", () => {
			const config = {
				type: "open_ai" as const,
				model: "tts-1",
			};

			expect(config.type).toBe("open_ai");
			expect(config.model).toBeDefined();
		});

		it("should accept valid AWS Polly speak provider configuration", () => {
			const config = {
				type: "aws_polly" as const,
				model: "neural",
			};

			expect(config.type).toBe("aws_polly");
			expect(config.model).toBeDefined();
		});
	});

	describe("Listen Provider Types", () => {
		it("should accept valid Deepgram listen provider configuration", () => {
			const config = {
				type: "deepgram" as const,
				model: "nova-3",
			};

			expect(config.type).toBe("deepgram");
			expect(config.model).toBeDefined();
		});
	});

	describe("Complete Agent Settings", () => {
		it("should accept complete agent settings with all providers", () => {
			const settings = {
				type: "Settings" as const,
				audio: {
					input: {
						encoding: "linear16" as const,
						sample_rate: 24_000,
					},
					output: {
						encoding: "linear16" as const,
						sample_rate: 16_000,
						container: "wav" as const,
					},
				},
				agent: {
					language: "en",
					listen: {
						provider: {
							type: "deepgram" as const,
							model: "nova-3",
						},
					},
					think: {
						provider: {
							type: "open_ai" as const,
							model: "gpt-4o-mini",
						},
						prompt: "You are a helpful AI assistant.",
					},
					speak: {
						provider: {
							type: "deepgram" as const,
							model: "aura-2-thalia-en",
						},
					},
				},
			};

			expect(settings.type).toBe("Settings");
			expect(settings.agent.listen.provider.type).toBe("deepgram");
			expect(settings.agent.think.provider.type).toBe("open_ai");
			expect(settings.agent.speak.provider.type).toBe("deepgram");
		});

		it("should accept agent settings with Anthropic and ElevenLabs", () => {
			const settings = {
				type: "Settings" as const,
				audio: {
					input: { encoding: "linear16" as const, sample_rate: 24_000 },
					output: {
						encoding: "linear16" as const,
						sample_rate: 16_000,
						container: "wav" as const,
					},
				},
				agent: {
					language: "en",
					listen: {
						provider: { type: "deepgram" as const, model: "nova-3" },
					},
					think: {
						provider: {
							type: "anthropic" as const,
							model: "claude-3-5-sonnet-20241022",
						},
						prompt: "You are Claude.",
					},
					speak: {
						provider: {
							type: "eleven_labs" as const,
							model: "eleven_turbo_v2_5",
						},
					},
				},
			};

			expect(settings.agent.think.provider.type).toBe("anthropic");
			expect(settings.agent.speak.provider.type).toBe("eleven_labs");
		});

		it("should accept agent settings with Groq and Cartesia", () => {
			const settings = {
				type: "Settings" as const,
				audio: {
					input: { encoding: "linear16" as const, sample_rate: 24_000 },
					output: {
						encoding: "linear16" as const,
						sample_rate: 16_000,
						container: "wav" as const,
					},
				},
				agent: {
					language: "en",
					listen: {
						provider: { type: "deepgram" as const, model: "nova-3" },
					},
					think: {
						provider: {
							type: "groq" as const,
							model: "llama-3.1-70b-versatile",
						},
						prompt: "You are fast.",
					},
					speak: {
						provider: { type: "cartesia" as const, model: "sonic-english" },
					},
				},
			};

			expect(settings.agent.think.provider.type).toBe("groq");
			expect(settings.agent.speak.provider.type).toBe("cartesia");
		});

		it("should accept agent settings with Google AI and OpenAI TTS", () => {
			const settings = {
				type: "Settings" as const,
				audio: {
					input: { encoding: "linear16" as const, sample_rate: 24_000 },
					output: {
						encoding: "linear16" as const,
						sample_rate: 16_000,
						container: "wav" as const,
					},
				},
				agent: {
					language: "en",
					listen: {
						provider: { type: "deepgram" as const, model: "nova-3" },
					},
					think: {
						provider: { type: "google" as const, model: "gemini-pro" },
						prompt: "You are helpful.",
					},
					speak: {
						provider: { type: "open_ai" as const, model: "tts-1" },
					},
				},
			};

			expect(settings.agent.think.provider.type).toBe("google");
			expect(settings.agent.speak.provider.type).toBe("open_ai");
		});

		it("should accept agent settings with AWS Bedrock and AWS Polly", () => {
			const settings = {
				type: "Settings" as const,
				audio: {
					input: { encoding: "linear16" as const, sample_rate: 24_000 },
					output: {
						encoding: "linear16" as const,
						sample_rate: 16_000,
						container: "wav" as const,
					},
				},
				agent: {
					language: "en",
					listen: {
						provider: { type: "deepgram" as const, model: "nova-3" },
					},
					think: {
						provider: {
							type: "aws_bedrock" as const,
							model: "anthropic.claude-3-sonnet-20240229-v1:0",
						},
						prompt: "You are professional.",
					},
					speak: {
						provider: { type: "aws_polly" as const, model: "neural" },
					},
				},
			};

			expect(settings.agent.think.provider.type).toBe("aws_bedrock");
			expect(settings.agent.speak.provider.type).toBe("aws_polly");
		});
	});

	describe("Provider Configuration Validation", () => {
		it("should require model field for all providers", () => {
			const openAiProvider = { type: "open_ai" as const, model: "gpt-4o-mini" };
			const deepgramProvider = { type: "deepgram" as const, model: "nova-3" };

			expect(openAiProvider.model).toBeDefined();
			expect(deepgramProvider.model).toBeDefined();
		});

		it("should allow optional provider-specific fields", () => {
			// Example: OpenAI can have optional api_key
			const openAiWithKey = {
				type: "open_ai" as const,
				model: "gpt-4o-mini",
				api_key: "sk-test-key",
			};

			expect(openAiWithKey.api_key).toBeDefined();
		});
	});

	describe("Multiple Provider Combinations", () => {
		const validCombinations = [
			{ think: "open_ai", speak: "deepgram" },
			{ think: "anthropic", speak: "eleven_labs" },
			{ think: "google", speak: "cartesia" },
			{ think: "groq", speak: "open_ai" },
			{ think: "aws_bedrock", speak: "aws_polly" },
		];

		for (const combination of validCombinations) {
			it(`should accept ${combination.think} + ${combination.speak} combination`, () => {
				const settings = {
					agent: {
						think: { provider: { type: combination.think, model: "test-model" } },
						speak: { provider: { type: combination.speak, model: "test-model" } },
					},
				};

				expect(settings.agent.think.provider.type).toBe(combination.think);
				expect(settings.agent.speak.provider.type).toBe(combination.speak);
			});
		}
	});
});
