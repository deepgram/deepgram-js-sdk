// @ts-check
/** @typedef {import("../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
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
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

