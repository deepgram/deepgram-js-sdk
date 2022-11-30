export type Topic = {
  /**
   * Topic detected.
   */
  topic: string;
  /**
   * Value between 0 and 1 indicating the model's relative confidence in this topic.
   */
  confidence: number;
};
