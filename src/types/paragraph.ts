import { Sentence } from "./sentence";

export type Paragraph = {
  /**
   * Sentences within the paragraph.
   */
  sentences: Array<Sentence>;
  /**
   * Start time (in seconds) from the start of the audio to where the paragraph starts.
   */
  start: number;
  /**
   * End time (in seconds) from the start of the audio to where the paragraph ends.
   */
  end: number;
  /**
   * Number of words in the paragraph
   */
  num_words: number;
};
