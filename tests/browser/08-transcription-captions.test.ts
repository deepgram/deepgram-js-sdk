import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  hasCorsError,
  waitForElement,
} from "./helpers";

describe("Browser Example: 08-transcription-captions", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should attempt transcription (expecting CORS error)", async () => {
    const apiKey = getApiKey();

    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    const url = getExampleUrl("08-transcription-captions.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    await fillApiKey(page, apiKey);
    await clickButton(page, "runExample");

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

