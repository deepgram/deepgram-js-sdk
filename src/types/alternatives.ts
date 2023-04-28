import { ParagraphGroup } from "./paragraphGroup";
import { WordBase } from "./wordBase";
import { Entity } from "./entity";
import { Summary } from "./summary";
import { Translation } from "./translation";
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
  paragraphs?: ParagraphGroup;
  /**
   * Array of entity objects.
   */
  entities?: Array<Entity>;

  /**
   * Array of language objects for each language the response has been translated into
   */
  translations?: Array<Translation>;
  /**
   * Array of topic group objects.
   */
  topics?: Array<TopicGroup>;
};
