// @ts-check
/** @typedef {import("../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        const connection = await client.speak.v1.connect({
            model: 'aura-2-asteria-en',
            encoding: 'linear16',
            sample_rate: 24000
        });

        connection.on('open', () => {
            console.log('Connection opened');
        });

        connection.on('message', (message) => {
            if (message instanceof Buffer || message instanceof ArrayBuffer) {
                console.log('Received audio event');
            } else {
                const msgType = message?.type || 'Unknown';
                console.log(`Received ${msgType} event`);
            }
        });

        connection.on('close', () => {
            console.log('Connection closed');
        });

        connection.on('error', (error) => {
            console.log(`Caught: ${error.message || error}`);
        });

        // Send control messages
        console.log('Send Flush message');
        connection.sendControl({ type: 'Flush' });
        console.log('Send Close message');
        connection.sendControl({ type: 'Close' });

        // EXAMPLE ONLY: Wait briefly to see some events before exiting
        // In production, you would typically keep the connection alive and send text data
        // or integrate into your application's event loop
        setTimeout(() => {
            connection.close();
        }, 3000); // EXAMPLE ONLY: Wait 3 seconds before closing
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

