import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { clickButton, getExampleUrl, getSpacewalkAudioPath, uploadFile, waitForOutputMatching } from "./helpers";

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
        const output = await waitForOutputMatching(
            page,
            (value) => value.includes("✓ Transcription:") && !value.includes("No transcript found"),
        );

        expect(output).toContain("✓ Transcription:");
        expect(output).not.toContain("No transcript found");
    }, 30000);
});
