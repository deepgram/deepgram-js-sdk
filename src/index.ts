import DeepgramClient from "./DeepgramClient";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * Creates a new Deepgram Client.
 */
export const createClient = (apiKey: string, options?: DeepgramClientOptions): DeepgramClient => {
  return new DeepgramClient(apiKey, options);
};

export * from "./lib/types";
export * from "./lib/enums";
