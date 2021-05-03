/**
 * Options to initialize the Deepgram SDK
 */
export type Options = {
  /**
   * Deepgram API Key used to access the API
   */
  apiKey: string;
  /**
   * Corresponding API Secret used to access the API
   */
  apiSecret: string;
  /**
   * Optional custom API endpoint url
   */
  apiUrl?: string;
};
