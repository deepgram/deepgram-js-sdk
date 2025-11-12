const { DeepgramClient } = require('../../../../../../dist/cjs/index.js');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        console.log('Request sent');
        const response = await client.read.v1.text.analyze({
            text: 'Hello, world!'
        }, {
            language: 'en',
            sentiment: true,
            summarize: true,
            topics: true,
            intents: true
        });
        console.log('Response received');
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

