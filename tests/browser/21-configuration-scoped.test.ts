import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  hasCorsError,
  waitForElement,
  findRunButton,
} from "./helpers";

describe("Browser Example: 21-configuration-scoped", () => {
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
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    const url = getExampleUrl("21-configuration-scoped.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    await fillApiKey(page, apiKey);
    
    const runButtonId = await findRunButton(page);
    if (runButtonId) {
      await clickButton(page, runButtonId);
    }

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

