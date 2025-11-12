const { DeepgramClient } = require('../../../../../../dist/cjs/index.js');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        console.log('Request sent');
        const response = await client.listen.v1.media.withRawResponse.transcribeUrl({
            url: 'https://dpgr.am/spacewalk.wav'
        }, {
            model: 'nova-3'
        });
        console.log('Response received');
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

