const { DeepgramClient } = require('../../../../../dist/cjs/index.js');

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

        const connection = await client.listen.v1.connect({
            model: 'nova-3'
        });

        connection.on('open', () => {
            console.log('Connection opened');
        });

        connection.on('message', (message) => {
            const msgType = message?.type || 'Unknown';
            console.log(`Received ${msgType} event`);
        });

        connection.on('close', () => {
            console.log('Connection closed');
        });

        connection.on('error', (error) => {
            console.log(`Caught: ${error.message || error}`);
        });

        // EXAMPLE ONLY: Wait briefly to see some events before exiting
        // In production, you would typically keep the connection alive and send audio data
        // or integrate into your application's event loop
        setTimeout(() => {
            connection.close();
        }, 3000); // EXAMPLE ONLY: Wait 3 seconds before closing
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

