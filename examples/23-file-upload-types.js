/**
 * Example: File Upload Types
 *
 * Demonstrates different file upload types supported by the SDK.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Example 1: Using fs.ReadStream
async function transcribeWithReadStream() {
  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      createReadStream("./examples/spacewalk.wav"),
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Using Buffer
async function transcribeWithBuffer() {
  const fs = require("fs");
  const buffer = fs.readFileSync("./examples/spacewalk.wav");

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      buffer,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Using ReadableStream
async function transcribeWithReadableStream() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const stream = response.body;

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      stream,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Using Blob (browser)
async function transcribeWithBlob() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const blob = await response.blob();

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      blob,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Using File (browser)
async function transcribeWithFile(fileInput) {
  const file = fileInput.files[0];

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      file,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Using ArrayBuffer
async function transcribeWithArrayBuffer() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const arrayBuffer = await response.arrayBuffer();

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      arrayBuffer,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 7: Using Uint8Array
async function transcribeWithUint8Array() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  try {
    const { data } = await deepgramClient.listen.v1.media.transcribeFile(
      uint8Array,
      {
        model: "nova-3",
      },
    );
    console.log("Transcription:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
transcribeWithReadStream();
transcribeWithBuffer();
transcribeWithReadableStream();
transcribeWithBlob();
// transcribeWithFile(document.getElementById("fileInput")); // Browser only
transcribeWithArrayBuffer();
transcribeWithUint8Array();
