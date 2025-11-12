const { DeepgramClient } = require('../../../../../dist/cjs/index.js');

// Client uses DEEPGRAM_API_KEY from environment
const client = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY
});

(async () => {
    try {
        // Note: WebSocket connections don't have a withRawResponse equivalent
        // This test is included for completeness but behaves the same as main.js
        const agent = await client.agent.v1.connect();

        // Send minimal settings to configure the agent per the latest spec
        const settings = {
            audio: {
                input: {
                    encoding: 'linear16',
                    sample_rate: 44100
                }
            },
            agent: {
                listen: {
                    provider: {
                        type: 'deepgram',
                        model: 'nova-3',
                        smart_format: true
                    }
                },
                think: {
                    provider: {
                        type: 'open_ai',
                        model: 'gpt-4o-mini',
                        temperature: 0.7
                    },
                    prompt: 'Reply only and explicitly with "OK".'
                },
                speak: {
                    provider: {
                        type: 'deepgram',
                        model: 'aura-2-asteria-en'
                    }
                }
            }
        };

        console.log('Send SettingsConfiguration message');
        agent.sendSettings(settings);

        agent.on('open', () => {
            console.log('Connection opened');
        });

        agent.on('message', (message) => {
            if (message instanceof Buffer || message instanceof ArrayBuffer) {
                console.log('Received audio event');
            } else {
                const msgType = message?.type || 'Unknown';
                console.log(`Received ${msgType} event`);
            }
        });

        agent.on('close', () => {
            console.log('Connection closed');
        });

        agent.on('error', (error) => {
            console.log(`Caught: ${error.message || error}`);
        });

        // EXAMPLE ONLY: Wait briefly to see some events before exiting
        // In production, you would typically keep the connection alive and send audio data
        // or integrate into your application's event loop
        setTimeout(() => {
            agent.close();
        }, 3000); // EXAMPLE ONLY: Wait 3 seconds before closing
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();

