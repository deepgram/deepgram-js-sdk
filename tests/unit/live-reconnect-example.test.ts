import { describe, expect, it } from "vitest";

import { timestampOffsetSeconds } from "../../examples/41-transcription-live-reconnect";

describe("live reconnect example", () => {
    it("keeps discarded buffered audio in the post-reconnect timestamp offset", () => {
        const bytesPerSecond = 44100 * 2;
        const deliveredBytes = bytesPerSecond * 8;
        const droppedBytes = bytesPerSecond * 32;

        // After a 32-second overflow, the retained buffer starts at 40 seconds.
        expect(timestampOffsetSeconds(deliveredBytes, droppedBytes)).toBe(40);
    });
});
