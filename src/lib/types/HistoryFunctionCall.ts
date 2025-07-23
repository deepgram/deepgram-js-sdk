/**
 * History function call message schema for agent context
 * @see API specification for agent context history
 */
export interface HistoryFunctionCall {
  /**
   * Message type identifier for function calls
   */
  type: "History";

  /**
   * List of function call objects
   */
  function_calls: {
    /**
     * Unique identifier for the function call
     */
    id: string;

    /**
     * Name of the function called
     */
    name: string;

    /**
     * Indicates if the call was client-side or server-side
     */
    client_side: boolean;

    /**
     * Arguments passed to the function
     */
    arguments: string;

    /**
     * Response from the function call
     */
    response: string;
  }[];
}
