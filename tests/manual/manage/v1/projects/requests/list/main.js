// @ts-check
/** @typedef {import("../../../../../../../dist/cjs/index.js").DeepgramClient} */
const { DeepgramClient } = require("../../../../../../../dist/cjs/index.js");

/** @type {DeepgramClient} */
const client = new DeepgramClient();

(async () => {
    try {
        console.log('Request sent');
        const response = await client.manage.v1.projects.requests.list("123456-7890-1234-5678-901234", {
            start: "2024-01-15T09:30:00Z",
            end: "2024-01-15T09:30:00Z",
            limit: 1.1,
            page: 1.1,
            accessor: "12345678-1234-1234-1234-123456789012",
            request_id: "12345678-1234-1234-1234-123456789012",
            deployment: "hosted",
            endpoint: "listen",
            method: "sync",
            status: "succeeded",
        });
        console.log('Response received');
    } catch (e) {
        console.error(`Error: ${e.message || e}`);
        throw e;
    }
})();

