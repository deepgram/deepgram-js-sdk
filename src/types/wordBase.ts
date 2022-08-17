export type WordBase = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
  speaker?: number;
  // speaker_confidence will only be included if 'diarize=latest' or 'diarize=VERSION' is passed in the request
  speaker_confidence?: number;
};
