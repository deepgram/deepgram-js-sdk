const { DeepgramClient } = require('../../../../../../dist/cjs/index.js');
const fs = require('fs');
const path = require('path');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        // Path to audio file from fixtures
        const audioPath = path.join(__dirname, '..', '..', '..', '..', 'fixtures', 'audio.wav');
        const audioData = fs.readFileSync(audioPath);

        console.log('Request sent');
        const response = await client.listen.v1.media.withRawResponse.transcribeFile(audioData, {
            model: 'nova-3'
        });
        console.log('Response received');
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

