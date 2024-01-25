export enum LiveTranscriptionEvents {
  Open = "open",
  Close = "close",
  Transcript = "Results", // exact match to data type from API
  Metadata = "Metadata", // exact match to data type from API
  Error = "error",
  Warning = "warning",
  UtteranceEnd = "UtteranceEnd", // exact match to data type from API
  SpeechStarted = "SpeechStarted",
}
