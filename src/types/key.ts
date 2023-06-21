/**
 * API key used for authenticating with the Deepgram API
 */
export type Key = {
  /**
   * Unique identifier of the key to use in API requests
   */
  api_key_id: string;
  /**
   * API key to send in API requests (Only displayed when first created)
   */
  key?: string;
  /**
   * Comment for user reference
   */
  comment: string;
  /**
   * Timestamp of the date/time the key was created
   */
  created: string;
  /**
   * Array of scopes assigned to the key
   */
  scopes: Array<string>;
  err_code?: string;
  err_msg?: string;
};
