// @ts-check
/** @typedef {import("../../../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.manage.v1.projects.usage.breakdown.get("123456-7890-1234-5678-901234", {
            start: "start",
            end: "end",
            grouping: "accessor",
            accessor: "12345678-1234-1234-1234-123456789012",
            alternatives: true,
            callback_method: true,
            callback: true,
            channels: true,
            custom_intent_mode: true,
            custom_intent: true,
            custom_topic_mode: true,
            custom_topic: true,
            deployment: "hosted",
            detect_entities: true,
            detect_language: true,
            diarize: true,
            dictation: true,
            encoding: true,
            endpoint: "listen",
            extra: true,
            filler_words: true,
            intents: true,
            keyterm: true,
            keywords: true,
            language: true,
            measurements: true,
            method: "sync",
            model: "6f548761-c9c0-429a-9315-11a1d28499c8",
            multichannel: true,
            numerals: true,
            paragraphs: true,
            profanity_filter: true,
            punctuate: true,
            redact: true,
            replace: true,
            sample_rate: true,
            search: true,
            sentiment: true,
            smart_format: true,
            summarize: true,
            tag: "tag1",
            topics: true,
            utt_split: true,
            utterances: true,
            version: true,
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

