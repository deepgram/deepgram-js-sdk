import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { clickButton, getExampleUrl, getOutputContent, getSpacewalkAudioPath, uploadFile } from "./helpers";

describe("Browser Example: 05-transcription-prerecorded-file", () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it("should successfully transcribe audio file", async () => {
        const spacewalkPath = getSpacewalkAudioPath();

        const url = getExampleUrl("05-transcription-prerecorded-file.html");
        await page.goto(url);
        await page.waitForLoadState("domcontentloaded");

        // No API key input needed - proxy handles auth
        await uploadFile(page, "#audioFile", spacewalkPath);
        await clickButton(page, "runExample");

        // The page writes "Transcribing..." immediately, before the live API response.
        // Wait for a non-empty transcript instead of treating that progress message as output.
        const deadline = Date.now() + 30000;
        let output = "";
        while (Date.now() < deadline) {
            output = await getOutputContent(page);
            if (output.includes("✗ Error:") || output.includes("✗ No data returned")) {
                throw new Error(`File transcription failed:\n${output}`);
            }
            if (output.includes("✓ Transcription:") && !output.includes("No transcript found")) {
                break;
            }
            await page.waitForTimeout(500);
        }

        expect(output, `Timed out waiting for a transcript. Last page output:\n${output}`).toContain(
            "✓ Transcription:",
        );
        expect(output).not.toContain("No transcript found");
    }, 30000);
});
