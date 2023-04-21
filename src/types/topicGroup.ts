import { Topic } from "./topic";

export type TopicGroup = {
  /**
   * Array of Topics identified.
   */
  topics: Array<Topic>;
  /**
   * Transcript covered by the topic.
   */
  text: string;
  /**
   * Word position in transcript where the topic begins
   */
  start_word: number;
  /**
   * Word position in transcript where the topic ends
   */
  end_word: number;
};
