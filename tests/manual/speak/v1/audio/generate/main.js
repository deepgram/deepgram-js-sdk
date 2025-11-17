// @ts-check
/** @typedef {import("../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.speak.v1.audio.generate({
            text: 'Hello, this is a sample text to speech conversion.'
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

