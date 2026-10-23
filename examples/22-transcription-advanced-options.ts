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
        const data = await deepgramClient.listen.v1.media.transcribeUrl({
            url: "https://dpgr.am/spacewalk.wav",
            model: "nova-3",
            language: "multi",
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
            // Bias Nova-3 multilingual detection toward the languages you expect.
            // Hints bias, they do not restrict, and they apply only with language: "multi".
            // Do not combine with detect_language, which switches to single-language detection.
            language_hint: ["en", "es"],
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

        console.log("Transcription with advanced options:", JSON.stringify(data, null, 2));
        const alternative = data.results?.channels?.[0]?.alternatives?.[0];
        console.log("Detected languages:", alternative?.languages ?? []);
        console.log("Applied language hints:", alternative?.languages_hinted ?? []);
    } catch (error) {
        console.error("Error:", error);
    }
}

// WORKS!
transcribeWithAdvancedOptions();
