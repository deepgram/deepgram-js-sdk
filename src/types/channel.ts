import { Alternative } from "./alternatives";
import { Search } from "./search";

/**
 * Channel of speech identified by Deepgram
 */
export type Channel = {
  /**
   * Searched terms & results
   */
  search?: Array<Search>;
  /**
   * Transcription alternatives
   */
  alternatives: Array<Alternative>;
  /**
   * String indicating the detected language. eg: 'en'
   */
  detected_language?: string;
};
