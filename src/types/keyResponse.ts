import { Key } from "./key";

/**
 * Response from the Deepgram API to list keys
 */
export type KeyResponse = {
  /**
   * Array of API keys associated with the project
   */
  api_keys: Array<Key>;
};
