export type Entity = {
  /**
   * This is the type of the entity.
   * Examples include: PER, ORG, DATE, etc.
   */
  label: string;
  /**
   * This is the value of the detected entity.
   */
  value: string;
  /**
   * Value between 0 and 1 indicating the model's relative confidence in this detected entity.
   */
  confidence: number;
  /**
   * Starting index of the entities words within the transcript.
   */
  start_word: number;
  /**
   * Ending index of the entities words within the transcript.
   */
  end_word: number;
};
