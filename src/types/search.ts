import { Hit } from "./hit";

/**
 * Search result for a transcription
 */
export type Search = {
  /**
   * Term for which Deepgram is searching.
   */
  query: string;
  /**
   * Instances of query found in transcript
   */
  hits: Array<Hit>;
};
