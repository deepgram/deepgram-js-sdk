/**
 * Example: Transcription with Advanced Options
 *
 * Demonstrates various transcription options including sentiment analysis,
 * topic detection, entity detection, and more.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function transcribeWithAdvancedOptions() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
      language: "en",
      punctuate: true,
      paragraphs: true,
      utterances: true,
      smart_format: true,
      // Sentiment analysis
      sentiment: true,
      // Topic detection
      topics: true,
      custom_topic: "custom_topic",
      custom_topic_mode: "extended",
      // Intent detection
      intents: true,
      custom_intent: "custom_intent",
      custom_intent_mode: "extended",
      // Entity detection
      detect_entities: true,
      // Language detection
      detect_language: true,
      // Speaker diarization
      diarize: true,
      // Dictation mode
      dictation: true,
      // Keyterms (keywords not supported for Nova-3)
      keyterm: ["keyword1", "keyword2"],
      // Profanity filter
      profanity_filter: true,
      // Redaction
      redact: ["pci", "ssn"],
      // Replace words
      replace: "word1:replacement1,word2:replacement2",
      // Search terms
      search: ["term1", "term2"],
      // Utterance split threshold
      utt_split: 0.8,
      // Multichannel
      multichannel: true,
      // Numerals
      numerals: true,
      // Measurements
      measurements: true,
      // Filler words
      filler_words: true,
    });

    console.log(
      "Transcription with advanced options:",
      JSON.stringify(data, null, 2),
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
transcribeWithAdvancedOptions();
