// @ts-check
/** @typedef {import("../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.manage.v1.models.get("af6e9977-99f6-4d8f-b6f5-dfdf6fb6e291");
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

