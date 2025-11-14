const path = require("path");
const fs = require("fs");
const { runBrowserTest } = require("../../../../browser-test-utils.js");

/**
 * Browser test for transcribeFile method
 * 
 * Tests the SDK's ability to upload and transcribe audio files in a browser environment.
 * Serves a local audio file via HTTP and tests binary data handling.
 */

(async () => {
    await runBrowserTest({
        testDir: __dirname,
        port: 8766,
        timeout: 30000,
        customFileHandler: (req, res, testDir) => {
            // Handle audio file request
            if (req.url === "/audio.wav") {
                const audioPath = path.resolve(__dirname, "../../../../../../tests/manual/fixtures/audio.wav");
                const fixturesPath = path.resolve(__dirname, "../../../../../../tests/manual/fixtures");
                
                // Security check
                if (!audioPath.startsWith(fixturesPath)) {
                    res.writeHead(403);
                    res.end("Forbidden");
                    return true;
                }

                fs.readFile(audioPath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end("Audio file not found");
                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type": "audio/wav",
                        "Access-Control-Allow-Origin": "*",
                    });
                    res.end(data);
                });
                return true; // Handled
            }
            return false; // Not handled, use default
        },
    });
})();
