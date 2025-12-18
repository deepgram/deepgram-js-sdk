import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  uploadFile,
  hasCorsError,
  waitForElement,
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

  it("should attempt transcription with file (expecting CORS error)", async () => {
    const apiKey = getApiKey();
    const spacewalkPath = getSpacewalkAudioPath();

    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    const url = getExampleUrl("23-file-upload-types.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    await fillApiKey(page, apiKey);
    await uploadFile(page, "#audioFile", spacewalkPath);
    await clickButton(page, "fileButton");

    try {
      await waitForElement(page, "#output", 10000);
      await page.waitForTimeout(2000);
    } catch (error) {
      // Output might not appear
    }

    const allMessages = [...consoleMessages, ...pageErrors];
    const hasCors = await hasCorsError(page, allMessages);
    expect(hasCors).toBe(true);
  }, 10000);
});

