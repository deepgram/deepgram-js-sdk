import DeepgramClient from "./DeepgramClient";

/**
 * Creates a new Deepgram Client.
 */
export const createClient = (apiKey: string, options: object) => {
  return new DeepgramClient(apiKey, options);
};
