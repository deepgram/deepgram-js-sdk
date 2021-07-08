/**
 * Represents an identified search term in the transcript
 */
export type Hit = {
  /**
   * Value between 0 and 1 that indicates the model's relative confidence in this hit.
   */
  confidence: number;
  /**
   * Offset in seconds from the start of the audio to where the hit occurs.
   */
  start: number;
  /**
   * Offset in seconds from the start of the audio to where the hit ends.
   */
  end: number;
  /**
   * Transcript that corresponds to the time between start and end.
   */
  snippet: string;
};
