// @ts-check
/** @typedef {import("../../../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.manage.v1.projects.billing.breakdown.list("123456-7890-1234-5678-901234", {
            start: "start",
            end: "end",
            accessor: "12345678-1234-1234-1234-123456789012",
            deployment: "hosted",
            tag: "tag1",
            line_item: "streaming::nova-3",
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

