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

    /**
     * Unique identifier of the key to use in API requests
     * @deprecated This property has moved to api_key.api_key_id and will
     * be removed in future versions.
     */
    api_key_id: string;
    /**
     * API key to send in API requests (Only displayed when first created)
     * @deprecated This property has moved to api_key.key and will
     * be removed in future versions.
     */
    key?: string;
    /**
     * Comment for user reference
     * @deprecated This property has moved to api_key.comment and will
     * be removed in future versions.
     */
    comment: string;
    /**
     * Timestamp of the date/time the key was created
     * @deprecated This property has moved to api_key.created and will
     * be removed in future versions.
     */
    created: string;
    /**
     * Array of scopes assigned to the key
     * @deprecated This property has moved to api_key.scopes and will
     * be removed in future versions.
     */
    scopes: Array<string>;
  }>;
};
