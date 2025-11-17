// @ts-check
/** @typedef {import("../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log("Request sent");
        const response = await client.read.v1.text.analyze({
            language: "en",
            sentiment: true,
            summarize: "v2",
            topics: true,
            intents: true,
            body: {
                text: "Hello, world!",
            },
        });
        console.log("Response received");
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();
