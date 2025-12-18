import { resolve } from "path";
import { TEST_BASE_URL } from "./setup";

/**
 * Get the URL for an HTML example file (served via http-server)
 */
export function getExampleUrl(examplePath: string): string {
  // Remove leading slash if present
  const cleanPath = examplePath.startsWith("/") ? examplePath.slice(1) : examplePath;
  return `${TEST_BASE_URL}/${cleanPath}`;
}

/**
 * Wait for an element to appear in the page
 */
export async function waitForElement(
  page: any,
  selector: string,
  timeout = 5000
): Promise<any> {
  return page.waitForSelector(selector, { timeout });
}

/**
 * Fill API key input field
 */
export async function fillApiKey(page: any, apiKey: string): Promise<void> {
  const apiKeyInput = await waitForElement(page, "#apiKey");
  await apiKeyInput.fill(apiKey);
}

/**
 * Click a button by ID
 */
export async function clickButton(page: any, buttonId: string): Promise<void> {
  const button = await waitForElement(page, `#${buttonId}`);
  await button.click();
}

/**
 * Upload a file to a file input element
 */
export async function uploadFile(
  page: any,
  fileInputSelector: string,
  filePath: string
): Promise<void> {
  const fileInput = await waitForElement(page, fileInputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for output to appear (indicating the example ran)
 */
export async function waitForOutput(page: any, timeout = 30000): Promise<void> {
  await waitForElement(page, "#output", timeout);
  // Wait a bit more for content to appear
  await page.waitForTimeout(500);
}

/**
 * Get output content
 */
export async function getOutputContent(page: any): Promise<string> {
  const output = await waitForElement(page, "#output");
  const content = await output.textContent();
  return content || "";
}

/**
 * Check if output contains success message
 */
export async function hasSuccessOutput(page: any): Promise<boolean> {
  const content = await getOutputContent(page);
  return content.includes("✓") || content.includes("success");
}

/**
 * Check if output contains error message
 */
export async function hasErrorOutput(page: any): Promise<boolean> {
  const content = await getOutputContent(page);
  return content.includes("✗") || content.includes("Error");
}

/**
 * Check if there's a CORS error in the console messages or output
 */
export async function hasCorsError(
  page: any,
  consoleMessages: string[] = []
): Promise<boolean> {
  // Check output content
  let outputContent = "";
  try {
    outputContent = await getOutputContent(page);
  } catch (error) {
    // Output might not exist yet
  }
  const outputLower = outputContent.toLowerCase();

  // Common CORS error messages (more comprehensive patterns)
  const corsPatterns = [
    "cors",
    "cross-origin",
    "access-control-allow-origin",
    "has been blocked by cors policy",
    "no 'access-control-allow-origin'",
    "cors policy",
    "blocked by cors",
    "cors header",
    "preflight",
    "origin",
  ];

  // Check console messages
  for (const msg of consoleMessages) {
    const msgLower = msg.toLowerCase();
    if (corsPatterns.some((pattern) => msgLower.includes(pattern))) {
      return true;
    }
  }

  // Check output content
  if (corsPatterns.some((pattern) => outputLower.includes(pattern))) {
    return true;
  }

  // Also check for network errors that might indicate CORS
  // CORS errors often show up as network failures
  const errorPatterns = [
    "failed to fetch",
    "networkerror",
    "network error",
    "access to fetch",
    "fetch failed",
    "typeerror: failed to fetch",
  ];
  
  for (const msg of consoleMessages) {
    const msgLower = msg.toLowerCase();
    if (errorPatterns.some((pattern) => msgLower.includes(pattern))) {
      // For REST API calls, any fetch failure is likely CORS
      return true;
    }
  }
  
  // Check output for error messages that might be CORS-related
  const outputErrorPatterns = [
    "error:",
    "✗ error",
    "failed",
    "network",
  ];
  
  if (outputContent && outputErrorPatterns.some((pattern) => outputLower.includes(pattern))) {
    // If there's an error in output and it's a REST call, likely CORS
    // Check if it mentions fetch or network
    if (outputLower.includes("fetch") || outputLower.includes("network") || outputLower.includes("request")) {
      return true;
    }
  }

  return false;
}

/**
 * Check if WebSocket logs are appearing (transcripts or audio data)
 */
export async function hasWebSocketLogs(page: any): Promise<boolean> {
  try {
    const content = await getOutputContent(page);
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    const contentLower = content.toLowerCase();

    // Look for WebSocket-specific log patterns
    // User mentioned: transcripts or "audio data (length)" payloads
    const websocketPatterns = [
      "transcript",
      "audio received",
      "audio data",
      "audio received (length)",
      "connection opened",
      "metadata:",
      "message:",
      "results:",
      "is_final",
      "channel",
      "alternatives",
      "speech",
      "audio",
      "received",
      "length",
    ];

    // Check if any pattern matches
    const hasPattern = websocketPatterns.some((pattern) => contentLower.includes(pattern));
    
    // Also check if there's JSON content (WebSocket messages are often JSON)
    if (!hasPattern && content.includes("{") && content.includes("}")) {
      // Might be JSON output from WebSocket
      return true;
    }
    
    return hasPattern;
  } catch (error) {
    // Output might not exist yet
    return false;
  }
}

/**
 * Wait for WebSocket logs to appear, with timeout
 */
export async function waitForWebSocketLogs(
  page: any,
  timeout = 30000
): Promise<boolean> {
  const startTime = Date.now();
  
  // First, wait for output element to exist (with shorter timeout)
  try {
    await waitForElement(page, "#output", 5000);
  } catch (error) {
    // Output might not exist, that's okay
  }

  // Then check periodically for logs (check every 500ms for faster detection)
  while (Date.now() - startTime < timeout) {
    if (await hasWebSocketLogs(page)) {
      return true;
    }
    await page.waitForTimeout(500); // Check every 500ms for faster detection
  }
  return false;
}

/**
 * Get the path to the spacewalk audio file
 */
export function getSpacewalkAudioPath(): string {
  return resolve(__dirname, "../../examples/spacewalk.wav");
}

/**
 * Determine if an example file is a WebSocket example
 */
export function isWebSocketExample(exampleFile: string): boolean {
  return (
    exampleFile.includes("websocket") ||
    exampleFile.includes("streaming") ||
    exampleFile === "09-voice-agent.html" ||
    exampleFile === "11-text-to-speech-streaming.html"
  );
}

/**
 * Determine if an example file needs a file upload
 */
export function needsFileUpload(exampleFile: string): boolean {
  return (
    exampleFile.includes("file") ||
    exampleFile === "07-transcription-live-websocket.html" ||
    exampleFile === "09-voice-agent.html" ||
    exampleFile === "26-transcription-live-websocket-v2.html" ||
    exampleFile === "23-file-upload-types.html"
  );
}

/**
 * Find the run/start button ID for an example
 */
export async function findRunButton(page: any): Promise<string | null> {
  const buttonIds = [
    "runExample",
    "startButton",
    "listButton",
    "getButton",
    "transcribeButton",
  ];

  for (const buttonId of buttonIds) {
    const button = await page.$(`#${buttonId}`);
    if (button) {
      const isDisabled = await button.isDisabled();
      if (!isDisabled) {
        return buttonId;
      }
    }
  }

  // Fallback: find first enabled button
  const buttons = await page.$$("button:not([disabled])");
  if (buttons.length > 0) {
    const buttonId = await buttons[0].getAttribute("id");
    return buttonId || null;
  }

  return null;
}

/**
 * Find the stop button ID for WebSocket examples
 */
export async function findStopButton(page: any): Promise<string | null> {
  const stopButton = await page.$("#stopButton");
  if (stopButton) {
    return "stopButton";
  }
  return null;
}

