// @ts-check
/** @typedef {import("../../../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log("Request sent");
        const response = await client.agent.v1.settings.think.models.list();
        console.log("Response received");
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();
