/**
 * Example: Advanced Text Intelligence
 *
 * Demonstrates advanced text analysis features including:
 * - Sentiment analysis
 * - Topic detection (with custom topics)
 * - Intent recognition (with custom intents)
 * - URL-based analysis
 * - Multiple summarization options
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Example 1: Comprehensive text analysis with all features
async function comprehensiveAnalysis() {
  console.log("\n=== Comprehensive Text Analysis ===\n");

  const text = `I absolutely love the new product features you've launched!
The user interface is incredibly intuitive and the performance improvements are outstanding.
However, I'm a bit concerned about the pricing changes. The new tier structure seems confusing,
and I worry it might drive away some customers. Overall though, I'm excited about the direction
the company is heading. The focus on AI and machine learning is exactly what the industry needs.
I'd love to see more tutorials and documentation to help users get started.`;

  try {
    const data = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      sentiment: true,
      summarize: true,
      topics: true,
      intents: true,
    });

    console.log("Analysis result:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Custom topics detection
async function customTopicsAnalysis() {
  console.log("\n=== Custom Topics Analysis ===\n");

  const text = `The latest smartphone features an incredible camera system with 108MP resolution,
5G connectivity for lightning-fast downloads, and an amazing battery life that lasts up to 48 hours.
The display uses OLED technology with a 120Hz refresh rate. Security features include facial recognition
and an in-display fingerprint sensor. The device runs on the latest processor with 12GB of RAM.`;

  try {
    // Extended mode: Returns both custom topics AND model's own detected topics
    const extendedData = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      topics: true,
      custom_topic: ["camera", "battery", "display", "security", "performance"],
      custom_topic_mode: "extended",
    });

    console.log("Extended mode (custom + auto-detected topics):");
    console.log(JSON.stringify(extendedData, null, 2));

    // Strict mode: Returns ONLY the custom topics you specified
    const strictData = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      topics: true,
      custom_topic: ["camera", "battery", "display", "security", "performance"],
      custom_topic_mode: "strict",
    });

    console.log("\nStrict mode (only custom topics):");
    console.log(JSON.stringify(strictData, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Custom intents detection
async function customIntentsAnalysis() {
  console.log("\n=== Custom Intents Analysis ===\n");

  const text = `Hi, I'd like to schedule a demo of your platform for next week.
Also, can you send me pricing information for the enterprise plan?
I'm particularly interested in the API access and custom integrations.
Could someone from your sales team give me a call to discuss our specific requirements?`;

  try {
    // Extended mode: Returns both custom intents AND model's own detected intents
    const data = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      intents: true,
      custom_intent: [
        "schedule_demo",
        "request_pricing",
        "request_callback",
        "ask_question",
      ],
      custom_intent_mode: "extended",
    });

    console.log("Detected intents:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: URL-based analysis
async function urlAnalysis() {
  console.log("\n=== URL-based Analysis ===\n");

  try {
    const data = await deepgramClient.read.v1.text.analyze({
      body: {
        url: "https://dpgr.am/spacewalk.txt",
      },
      language: "en",
      sentiment: true,
      summarize: true,
      topics: true,
    });

    console.log("URL analysis result:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Sentiment analysis focus
async function sentimentAnalysis() {
  console.log("\n=== Sentiment Analysis ===\n");

  const positiveText = `This is absolutely amazing! I couldn't be happier with the results.
Everything exceeded my expectations and the team was incredibly helpful.`;

  const negativeText = `I'm very disappointed with this experience. The service was poor,
the product didn't work as advertised, and customer support was unhelpful.`;

  const neutralText = `The meeting is scheduled for 3 PM tomorrow. Please bring the quarterly
reports and be prepared to discuss the budget allocations.`;

  try {
    const positive = await deepgramClient.read.v1.text.analyze({
      text: positiveText,
      language: "en",
      sentiment: true,
    });

    const negative = await deepgramClient.read.v1.text.analyze({
      text: negativeText,
      language: "en",
      sentiment: true,
    });

    const neutral = await deepgramClient.read.v1.text.analyze({
      text: neutralText,
      language: "en",
      sentiment: true,
    });

    console.log("Positive text sentiment:");
    console.log(JSON.stringify(positive, null, 2));

    console.log("\nNegative text sentiment:");
    console.log(JSON.stringify(negative, null, 2));

    console.log("\nNeutral text sentiment:");
    console.log(JSON.stringify(neutral, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Combined analysis with callback
async function analysisWithCallback() {
  console.log("\n=== Analysis with Callback URL ===\n");

  const text = `Artificial intelligence and machine learning are transforming industries.
From healthcare to finance, these technologies are enabling new possibilities. However,
ethical considerations and responsible development remain crucial concerns.`;

  try {
    const data = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      sentiment: true,
      summarize: true,
      topics: true,
      callback: "https://your-callback-url.com/webhook",
      callback_method: "POST",
      tag: ["text-intelligence", "async-processing"],
    });

    console.log("Analysis initiated with callback:");
    console.log(JSON.stringify(data, null, 2));
    console.log("\nResults will be sent to the callback URL when processing completes.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run all examples
(async () => {
  await comprehensiveAnalysis();
  await customTopicsAnalysis();
  await customIntentsAnalysis();
  await urlAnalysis();
  await sentimentAnalysis();
  await analysisWithCallback();
})();
