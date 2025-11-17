// @ts-check
/** @typedef {import("../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.selfHosted.v1.distributionCredentials.create("123456-7890-1234-5678-901234", {
            provider: "quay",
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

