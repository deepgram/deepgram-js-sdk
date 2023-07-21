export type PreRecordedResponse = {
  metadata: Metadata;
  results: Result;
};

type Alternative = {
  transcript: string;
  confidence: number;
  words: Array<WordBase>;
  summaries?: Array<Summary>;
  paragraphs?: ParagraphGroup;
  entities?: Array<Entity>;
  translations?: Array<Translation>;
  topics?: Array<TopicGroup>;
};

type Channel = {
  search?: Array<Search>;
  alternatives: Array<Alternative>;
  detected_language?: string;
};

type Entity = {
  label: string;
  value: string;
  confidence: number;
  start_word: number;
  end_word: number;
};

type Hit = {
  confidence: number;
  start: number;
  end: number;
  snippet: string;
};

type Metadata = {
  transaction_key: string;
  request_id: string;
  sha256: string;
  created: string;
  duration: number;
  channels: number;
  models: Array<string>;
  model_info: Record<string, ModelInfo>;
  warnings?: Array<Warning>;
};

type ModelInfo = {
  name: string;
  version: string;
  arch: string;
};

type Paragraph = {
  sentences: Array<Sentence>;
  start: number;
  end: number;
  num_words: number;
};

type ParagraphGroup = {
  transcript: string;
  paragraphs: Array<Paragraph>;
};

type Result = {
  channels: Array<Channel>;
  utterances?: Array<Utterance>;
  summary?: TranscriptionSummary;
};

type Search = {
  query: string;
  hits: Array<Hit>;
};

type Sentence = {
  text: string;
  start: number;
  end: number;
};

type Summary = {
  summary?: string;
  start_word?: number;
  end_word?: number;
};

type TranscriptionSummary = {
  result: string;
  short: string;
};

type Topic = {
  topic: string;
  confidence: number;
};

type TopicGroup = {
  topics: Array<Topic>;
  text: string;
  start_word: number;
  end_word: number;
};

type Translation = {
  language: string;
  translation: string;
};

type Utterance = {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  words: Array<WordBase>;
  speaker?: number;
  id: string;
};

type Warning = {
  parameter: string;
  type: string;
  message: string;
};

type WordBase = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
  speaker?: number;
  speaker_confidence?: number;
};
