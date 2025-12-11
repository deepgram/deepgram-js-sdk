/**
 * Example: Request Options
 *
 * Demonstrates advanced request options including headers, query params,
 * retries, timeouts, and abort signals.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Example 1: Additional headers
async function withCustomHeaders() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeUrl(
      {
        url: "https://dpgr.am/spacewalk.wav",
        model: "nova-3",
      },
      {
        headers: {
          "X-Custom-Header": "custom value",
        },
      },
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Additional query parameters
async function withQueryParams() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeUrl(
      {
        url: "https://dpgr.am/spacewalk.wav",
        model: "nova-3",
      },
      {
        queryParams: {
          customQueryParamKey: "custom query param value",
        },
      },
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Custom retry configuration
async function withRetries() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeUrl(
      {
        url: "https://dpgr.am/spacewalk.wav",
        model: "nova-3",
      },
      {
        maxRetries: 0, // Override maxRetries at the request level
      },
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Custom timeout
async function withTimeout() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeUrl(
      {
        url: "https://dpgr.am/spacewalk.wav",
        model: "nova-3",
      },
      {
        timeoutInSeconds: 30, // Override timeout to 30s
      },
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Abort signal
async function withAbortSignal() {
  const controller = new AbortController();

  const promise = deepgramClient.listen.v1.media.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
    },
    {
      abortSignal: controller.signal,
    },
  );

  // Abort the request after 5 seconds
  setTimeout(() => {
    controller.abort();
    console.log("Request aborted");
  }, 5000);

  try {
    const { data } = await promise;
    console.log("Result:", data);
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
  try {
    const { data, rawResponse } = await deepgramClient.listen.v1.media
      .transcribeUrl({
        url: "https://dpgr.am/spacewalk.wav",
        model: "nova-3",
      })
      .withRawResponse();

    console.log("Data:", data);
    console.log("Headers:", rawResponse.headers);
    console.log("Status:", rawResponse.status);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
withCustomHeaders();
withQueryParams();
withRetries();
withTimeout();
withAbortSignal();
withRawResponse();
