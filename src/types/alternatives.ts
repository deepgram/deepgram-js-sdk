import { ParagraphGroup } from "./paragraphGroup";
import { WordBase } from "./wordBase";
import { Entity } from "./entity";
import { Summary } from "./summary";
import { TopicGroup } from "./topicGroup";

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
   * Array of entity objects.
   */
  entities?: Array<Entity>;
  /**
   * String indicating the detected language. eg: 'en'
   */
  detected_language?: string;
  /**
   * Array of topic group objects.
   */
  topics?: Array<TopicGroup>;
};
