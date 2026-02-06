import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  uploadFile,
  waitForOutput,
  hasSuccessOutput,
  getSpacewalkAudioPath,
} from "./helpers";

describe("Browser Example: 23-file-upload-types", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully transcribe with file upload", async () => {
    const spacewalkPath = getSpacewalkAudioPath();

    const url = getExampleUrl("23-file-upload-types.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    await uploadFile(page, "#audioFile", spacewalkPath);
    await clickButton(page, "fileButton");

    // Wait for output to appear (file upload transcription can take time)
    await waitForOutput(page, 30000);
    
    // Wait a bit more for transcription to complete
    await page.waitForTimeout(2000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

