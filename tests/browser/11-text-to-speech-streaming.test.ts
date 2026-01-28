import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  hasWebSocketLogs,
  waitForWebSocketLogs,
  findStopButton,
} from "./helpers";

describe("Browser Example: 11-text-to-speech-streaming", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should connect and receive WebSocket logs", async () => {
    const apiKey = getApiKey();

    const url = getExampleUrl("11-text-to-speech-streaming.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    await fillApiKey(page, apiKey);
    await clickButton(page, "startButton");

    const startTime = Date.now();
    const logsAppeared = await waitForWebSocketLogs(page, 30000);
    
    expect(logsAppeared).toBe(true);
    
    const hasLogs = await hasWebSocketLogs(page);
    expect(hasLogs).toBe(true);

    // Wait until 1 minute total has passed
    let elapsed = Date.now() - startTime;
    while (elapsed < 60000) {
      const stopButtonId = await findStopButton(page);
      if (stopButtonId) {
        const stopButton = await page.$(`#${stopButtonId}`);
        if (stopButton) {
          const isDisabled = await stopButton.isDisabled();
          if (isDisabled) {
            // Connection closed naturally
            break;
          }
        }
      }
      await page.waitForTimeout(2000);
      elapsed = Date.now() - startTime;
    }

    // If still running after 1 minute, stop it
    const stopButtonId = await findStopButton(page);
    if (stopButtonId) {
      const stopButton = await page.$(`#${stopButtonId}`);
      if (stopButton) {
        const isDisabled = await stopButton.isDisabled();
        if (!isDisabled) {
          await clickButton(page, stopButtonId);
          await page.waitForTimeout(1000);
        }
      }
    }
  }, 120000);
});

