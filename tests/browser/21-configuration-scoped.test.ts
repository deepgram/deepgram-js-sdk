import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
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

  it("should successfully call API with scoped configuration", async () => {
    const url = getExampleUrl("21-configuration-scoped.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    const runButtonId = await findRunButton(page);
    if (runButtonId) {
      await clickButton(page, runButtonId);
    }

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

