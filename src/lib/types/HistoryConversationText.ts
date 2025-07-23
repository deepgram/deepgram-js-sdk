/**
 * History conversation text message schema for agent context
 * @see API specification for agent context history
 */
export interface HistoryConversationText {
  /**
   * Message type identifier for conversation text
   */
  type: "History";

  /**
   * Identifies who spoke the statement
   */
  role: "user" | "assistant";

  /**
   * The actual statement that was spoken
   */
  content: string;
}
