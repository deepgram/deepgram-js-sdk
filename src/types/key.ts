/**
 * API key used for authenticating with the Deepgram API
 */
export declare type Key = {
  /**
   * Api key member object
   */
  member: {
    /**
     * Unique identifier of the member on this API key
     */
    member_id: string;
    /**
     * Email of the member
     */
    email: string;
  };
  /**
   * Api key object
   */
  api_key: {
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
  };
};
