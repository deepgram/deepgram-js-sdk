// @ts-check
/** @typedef {import("../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../dist/cjs/index.js");
const fs = require('fs');
const path = require('path');

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        // Path to audio file from fixtures
        const audioPath = path.join(__dirname, '..', '..', '..', '..', 'fixtures', 'audio.wav');
        const audioData = fs.readFileSync(audioPath);

        console.log('Request sent');
        const response = await client.listen.v1.media.transcribeFile(audioData, {
            model: 'nova-3'
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

