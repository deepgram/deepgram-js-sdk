import { DeepgramClientOptions } from "@type/DeepgramClientOptions";
import DeepgramClient from "./DeepgramClient";

/**
 * Creates a new Deepgram Client.
 */
export const createClient = (apiKey: string, options?: DeepgramClientOptions) => {
  return new DeepgramClient(apiKey, options);
};
