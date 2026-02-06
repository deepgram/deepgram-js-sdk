import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getProjectId } from "./setup";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
  findRunButton,
} from "./helpers";

describe("Browser Example: 18-management-billing", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully call management API", async () => {
    const url = getExampleUrl("18-management-billing.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    const projectIdInput = await page.$("#projectId");
    if (projectIdInput) {
      const projectId = getProjectId();
      if (projectId) {
        await projectIdInput.fill(projectId);
      }
    }
    
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

