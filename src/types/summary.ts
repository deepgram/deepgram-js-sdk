/**
 * Summary of a section of audio provided.
 */
export type Summary = {
  /**
   * Summary of a section of the transcript
   */
  summary?: string;
  /**
   * Word position in transcript where the summary begins
   */
  start_word?: number;
  /**
   * Word position in transcript where the summary ends
   */
  end_word?: number;
};
