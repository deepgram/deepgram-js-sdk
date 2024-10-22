export enum AgentEvents {
  /**
   * Built in socket events.
   */
  Open = "Open",
  Close = "Close",
  Error = "Error",
  /**
   * Audio event?
   */
  Audio = "Audio",
  /**
   * Message { type: string }
   */
  Welcome = "Welcome",
  ConversationText = "ConversationText",
  UserStartedSpeaking = "UserStartedSpeaking",
  AgentThinking = "AgentThinking",
  FunctionCalling = "FunctionCalling",
  AgentStartedSpeaking = "AgentStartedSpeaking",
  AgentAudioDone = "AgentAudioDone",
  InjectionRefused = "InjectionRefused",

  /**
   * Catch all for any other message event
   */
  Unhandled = "Unhandled",
}
