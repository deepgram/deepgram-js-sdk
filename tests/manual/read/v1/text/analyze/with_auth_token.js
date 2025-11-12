const { DeepgramClient } = require('../../../../../../dist/cjs/index.js');

(async () => {
    try {
        // Using access token instead of API key
        const authClient = new DeepgramClient({
            apiKey: process.env.DEEPGRAM_API_KEY
        });

        console.log('Request sent');
        const authResponse = await authClient.auth.v1.tokens.grant();
        console.log('Response received');

        const client = new DeepgramClient({
            apiKey: authResponse.accessToken,
            headers: {
                Authorization: `Bearer ${authResponse.accessToken}`
            }
        });

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

