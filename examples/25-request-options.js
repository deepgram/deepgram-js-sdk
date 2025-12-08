/**
 * Example: Request Options
 *
 * Demonstrates advanced request options including headers, query params,
 * retries, timeouts, and abort signals.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

// Example 1: Additional headers
async function withCustomHeaders() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        headers: {
          "X-Custom-Header": "custom value",
        },
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Result:", result);
}

// Example 2: Additional query parameters
async function withQueryParams() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        queryParams: {
          customQueryParamKey: "custom query param value",
        },
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Result:", result);
}

// Example 3: Custom retry configuration
async function withRetries() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        maxRetries: 0, // Override maxRetries at the request level
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Result:", result);
}

// Example 4: Custom timeout
async function withTimeout() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        timeoutInSeconds: 30, // Override timeout to 30s
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Result:", result);
}

// Example 5: Abort signal
async function withAbortSignal() {
  const controller = new AbortController();

  const promise = deepgramClient.listen.prerecorded.transcribeUrl(
    { url: "https://dpgr.am/spacewalk.wav" },
    {
      model: "nova-3",
      abortSignal: controller.signal,
    },
  );

  // Abort the request after 5 seconds
  setTimeout(() => {
    controller.abort();
    console.log("Request aborted");
  }, 5000);

  try {
    const { result, error } = await promise;

    if (error) {
      console.error("Error:", error);
      return;
    }

    console.log("Result:", result);
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

// Example 6: Access raw response data
async function withRawResponse() {
  const { data, rawResponse } = await deepgramClient.listen.prerecorded
    .transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
      },
    )
    .withRawResponse();

  console.log("Data:", data);
  console.log("Headers:", rawResponse.headers);
  console.log("Status:", rawResponse.status);
}

// Uncomment to run:
withCustomHeaders();
withQueryParams();
withRetries();
withTimeout();
withAbortSignal();
withRawResponse();
