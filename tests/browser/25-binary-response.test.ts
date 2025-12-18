import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  hasCorsError,
  waitForElement,
  getOutputContent,
} from "./helpers";

describe("Browser Example: 25-binary-response", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should attempt API call (expecting CORS error)", async () => {
    const apiKey = getApiKey();

    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    const networkResponses: string[] = [];
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    page.on("response", (response: any) => {
      if (!response.ok() && response.status() >= 400) {
        networkResponses.push(`HTTP Error ${response.status()}: ${response.url()}`);
      }
    });

    const url = getExampleUrl("25-binary-response.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    await fillApiKey(page, apiKey);
    // This example has multiple buttons - click the first one (streamButton)
    await clickButton(page, "streamButton");

    try {
      await waitForElement(page, "#output", 10000);
      await page.waitForTimeout(2000);
    } catch (error) {
      // Output might not appear
    }

    const outputContent = await getOutputContent(page);
    const allMessages = [...consoleMessages, ...pageErrors, ...networkResponses, outputContent];
    const hasCors = await hasCorsError(page, allMessages);
    expect(hasCors).toBe(true);
  }, 10000);
});

