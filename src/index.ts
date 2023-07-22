import DeepgramClient from "./DeepgramClient";
import type { DeepgramClientOptions } from "./lib/types/DeepgramClientOptions";

/**
 * Creates a new Deepgram Client.
 */
export const createClient = (apiKey: string, options?: DeepgramClientOptions): DeepgramClient => {
  return new DeepgramClient(apiKey, options);
};
