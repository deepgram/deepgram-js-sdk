export interface PreRecordedResponse {
  metadata: Metadata;
  results: Result;
}

interface Alternative {
  transcript: string;
  confidence: number;
  words: Array<WordBase>;
  summaries?: Array<Summary>;
  paragraphs?: ParagraphGroup;
  entities?: Array<Entity>;
  translations?: Array<Translation>;
  topics?: Array<TopicGroup>;
}

interface Channel {
  search?: Array<Search>;
  alternatives: Array<Alternative>;
  detected_language?: string;
}

interface Entity {
  label: string;
  value: string;
  confidence: number;
  start_word: number;
  end_word: number;
}

interface Hit {
  confidence: number;
  start: number;
  end: number;
  snippet: string;
}

interface Metadata {
  transaction_key: string;
  request_id: string;
  sha256: string;
  created: string;
  duration: number;
  channels: number;
  models: Array<string>;
  model_info: Record<string, ModelInfo>;
  warnings?: Array<Warning>;
}

interface ModelInfo {
  name: string;
  version: string;
  arch: string;
}

interface Paragraph {
  sentences: Array<Sentence>;
  start: number;
  end: number;
  num_words: number;
}

interface ParagraphGroup {
  transcript: string;
  paragraphs: Array<Paragraph>;
}

interface Result {
  channels: Array<Channel>;
  utterances?: Array<Utterance>;
  summary?: TranscriptionSummary;
}

interface Search {
  query: string;
  hits: Array<Hit>;
}

interface Sentence {
  text: string;
  start: number;
  end: number;
}

interface Summary {
  summary?: string;
  start_word?: number;
  end_word?: number;
}
interface TranscriptionSummary {
  result: string;
  short: string;
}

interface Topic {
  topic: string;
  confidence: number;
}

interface TopicGroup {
  topics: Array<Topic>;
  text: string;
  start_word: number;
  end_word: number;
}

interface Translation {
  language: string;
  translation: string;
}

interface Utterance {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  words: Array<WordBase>;
  speaker?: number;
  id: string;
}

interface Warning {
  parameter: string;
  type: string;
  message: string;
}

interface WordBase {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
  speaker?: number;
  speaker_confidence?: number;
}
