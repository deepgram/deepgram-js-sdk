const { DeepgramClient } = require('../../../../../../dist/cjs/index.js');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        console.log('Request sent');
        const response = await client.speak.v1.audio.generate({
            text: 'Hello, this is a sample text to speech conversion.'
        });
        console.log('Response received');
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

