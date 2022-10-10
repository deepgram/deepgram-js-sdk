import { ParagraphGroup } from "./paragraphGroup";
import { WordBase } from "./wordBase";
import { Summary } from "./summary";
import { Translation } from "./translation"

export type Alternative = {
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
  /**
   * Array of summary objects.
   */
  summaries?: Array<Summary>;
  /**
   * Array of paragraph objects.
   */
  paragraphs?: Array<ParagraphGroup>;
  /**
   * String indicating the detected language. eg: 'en'
   */
  detected_language?: string;
  /**
   * Array of language objects for each language the response has been translated into
   */
  translations?: Array<Translation>;
};
