/**
 * Example: Transcription with Advanced Options
 *
 * Demonstrates various transcription options including sentiment analysis,
 * topic detection, entity detection, and more.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function transcribeWithAdvancedOptions() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
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
        // Keywords
        keywords: ["keyword1", "keyword2"],
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
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(
    "Transcription with advanced options:",
    JSON.stringify(result, null, 2),
  );
}

// Uncomment to run:
transcribeWithAdvancedOptions();
