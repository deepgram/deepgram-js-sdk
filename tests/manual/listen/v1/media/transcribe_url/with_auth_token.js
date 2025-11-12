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
        const response = await client.listen.v1.media.transcribeUrl({
            url: 'https://dpgr.am/spacewalk.wav'
        }, {
            model: 'nova-3'
        });
        console.log('Response received');
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

