/**
 * Respond with this when you receive a `FunctionCallRequest` payload.
 */
export interface FunctionCallResponse {
  /**
   * This must be the ID that was received in the request.
   */
  function_call_id: string;
  /**
   * The result of the function call.
   */
  output: string;
}
