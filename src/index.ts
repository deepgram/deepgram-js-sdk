import DeepgramClient from "./DeepgramClient";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * Creates a new Deepgram Client.
 */
const createClient = (apiKey: string, options: DeepgramClientOptions = {}): DeepgramClient => {
  return new DeepgramClient(apiKey, options);
};

export { createClient, DeepgramClient };

/**
 * Helpful exports.
 */
export * from "./packages";
export * from "./lib/types";
export * from "./lib/enums";
export * from "./lib/constants";
export * from "./lib/errors";

/**
 * Captions.
 */
export { webvtt, srt } from "@deepgram/captions";
