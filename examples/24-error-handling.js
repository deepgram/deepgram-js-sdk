/**
 * Example: Error Handling
 * 
 * Demonstrates proper error handling with the SDK.
 */

const { createClient, DeepgramError } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function exampleWithErrorHandling() {
  try {
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
      }
    );

    if (error) {
      console.error("Error:", error);
      return;
    }

    console.log("Success:", result);
  } catch (err) {
    if (err instanceof DeepgramError) {
      console.error("Deepgram Error:");
      console.error("Status Code:", err.statusCode);
      console.error("Message:", err.message);
      console.error("Body:", err.body);
      console.error("Raw Response:", err.rawResponse);
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

// Example with error checking pattern
async function exampleWithErrorCheck() {
  const { result, error } = await deepgramClient.manage.getTokenDetails();

  if (error) {
    // Handle error
    console.error("Error occurred:", error);
    return;
  }

  // Use result
  console.log("Token details:", result);
}

// Uncomment to run:
exampleWithErrorHandling();
exampleWithErrorCheck();

