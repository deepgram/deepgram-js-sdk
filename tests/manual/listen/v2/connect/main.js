const { DeepgramClient } = require('../../../../../dist/cjs/index.js');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        const connection = await client.listen.v2.connect({
            model: 'flux-general-en',
            encoding: 'linear16',
            sample_rate: '16000'
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

