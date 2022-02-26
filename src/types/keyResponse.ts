import { Key } from "./key";
import { Member } from "./member";

/**
 * Response from the Deepgram API to list keys
 */
export type KeyResponse = {
  /**
   * Array of API keys associated with the project
   */
  api_keys: Array<{
    /**
     * Optional member associated with the API key
     */
    member?: Member;

    /**
     * API key
     */
    api_key: Key;
  }>;
};
