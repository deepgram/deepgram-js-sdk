import { KeyResponseObj } from "./keyResponseObj";

/**
 * Response from the Deepgram API to list keys
 */
export type KeyResponse = {
  /**
   * Array of API keys associated with the project
   */
  api_keys: Array<KeyResponseObj>;
  err_code?: string;
  err_msg?: string;
};
