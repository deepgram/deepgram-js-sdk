/**
 * Example: File Upload Types
 *
 * Demonstrates different file upload types supported by the SDK.
 */

const { createClient } = require("@deepgram/sdk");
const { createReadStream } = require("fs");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

// Example 1: Using fs.ReadStream
async function transcribeWithReadStream() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(
      createReadStream("./examples/spacewalk.wav"),
      {
        model: "nova-3",
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 2: Using Buffer
async function transcribeWithBuffer() {
  const fs = require("fs");
  const buffer = fs.readFileSync("./examples/spacewalk.wav");

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(buffer, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 3: Using ReadableStream
async function transcribeWithReadableStream() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const stream = response.body;

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(stream, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 4: Using Blob (browser)
async function transcribeWithBlob() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const blob = await response.blob();

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(blob, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 5: Using File (browser)
async function transcribeWithFile(fileInput) {
  const file = fileInput.files[0];

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(file, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 6: Using ArrayBuffer
async function transcribeWithArrayBuffer() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const arrayBuffer = await response.arrayBuffer();

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(arrayBuffer, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Example 7: Using Uint8Array
async function transcribeWithUint8Array() {
  const response = await fetch("https://dpgr.am/spacewalk.wav");
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeFile(uint8Array, {
      model: "nova-3",
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result);
}

// Uncomment to run:
transcribeWithReadStream();
transcribeWithBuffer();
transcribeWithReadableStream();
transcribeWithBlob();
transcribeWithFile(document.getElementById("fileInput"));
transcribeWithArrayBuffer();
transcribeWithUint8Array();
