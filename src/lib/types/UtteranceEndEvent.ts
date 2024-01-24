export interface LiveTranscriptionEvent {
  type: "UtteranceEnd";
  channel: number[];
  last_word_end: number;
}
