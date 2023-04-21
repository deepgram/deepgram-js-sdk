export type Sentence = {
  /**
   * Text transcript of the sentence.
   */
  text: string;
  /**
   * Start time (in seconds) from the start of the audio to where the sentence starts.
   */
  start: number;
  /**
   * End time (in seconds) from the start of the audio to where the sentence ends.
   */
  end: number;
};
