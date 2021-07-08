import { Search } from "./search";
import { WordBase } from "./wordBase";

/**
 * Channel of speech identified by Deepgram
 */
export type Channel = {
  /**
   * Searched terms & results
   */
  search?: Array<Search>;
  alternatives: Array<{
    /**
     * Text of speech identified by API
     */
    transcript: string;
    /**
     * Confidence in transcript generated
     */
    confidence: number;
    /**
     * Array of words included in the transcript
     */
    words: Array<WordBase>;
  }>;
};
