export type TopicGroup = {
  topics: Array<Topic>;
  text: string;
  start_word: number;
  end_word: number;
};

export type Topic = {
  topic: string;
  confidence: number;
};
