export type WordBase = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
};
