export enum LiveTranscriptionEvents {
  /**
   * Built in socket events.
   */
  Open = "open",
  Close = "close",
  Error = "error",

  /**
   * Message { type: string }
   */
  Transcript = "Results",
  Metadata = "Metadata",
  UtteranceEnd = "UtteranceEnd",
  SpeechStarted = "SpeechStarted",

  /**
   * Catch all for any other message event
   */
  Unhandled = "Unhandled",
}
