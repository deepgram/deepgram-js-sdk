/**
 * Example: Binary Response Handling
 *
 * Demonstrates how to handle binary responses from the SDK (e.g., TTS audio).
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createWriteStream } = require("fs");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Example 1: Save binary response to file using ReadableStream (Node.js - most efficient)
async function saveToFileWithStream() {
  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  const stream = response.stream();
  const nodeStream = Readable.fromWeb(stream);
  const writeStream = createWriteStream("output.wav");

  await pipeline(nodeStream, writeStream);
  console.log("File saved successfully");
}

// Example 2: Save binary response using ArrayBuffer (Node.js)
async function saveToFileWithArrayBuffer() {
  const { writeFile } = require("fs/promises");

  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  const arrayBuffer = await response.arrayBuffer();
  await writeFile("output1.wav", Buffer.from(arrayBuffer));
  console.log("File saved successfully");
}

// Example 3: Save binary response using Blob (Node.js)
async function saveToFileWithBlob() {
  const { writeFile } = require("fs/promises");

  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  await writeFile("output2.wav", Buffer.from(arrayBuffer));
  console.log("File saved successfully");
}

// Example 4: Save binary response using Bytes (Node.js)
async function saveToFileWithBytes() {
  const { writeFile } = require("fs/promises");

  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  const bytes = await response.bytes();
  await writeFile("output3.wav", bytes);
  console.log("File saved successfully");
}

// Example 5: Convert binary response to text
async function convertToText() {
  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  const stream = response.stream();
  const text = await new Response(stream).text();
  console.log("Text:", text.substring(0, 10));
}

// Example 6: Check if response body has been used
async function checkBodyUsed() {
  const response = await deepgramClient.speak.v1.audio.generate({
    text: "Hello, this is a test.",
    model: "aura-2-thalia-en",
  });

  console.log("Body used:", response.bodyUsed); // false


  // You can only use the response body once
  const arrayBuffer = await response.arrayBuffer();
  console.log("Array buffer:", arrayBuffer.slice(0, 10));
  console.log("Body used:", response.bodyUsed); // true
}

// Uncomment to run:
saveToFileWithStream();
saveToFileWithArrayBuffer();
saveToFileWithBlob();
saveToFileWithBytes();
convertToText();
checkBodyUsed();
