export interface SyncPrerecordedResponse {
  metadata: Metadata;
  results: Result;
}

interface Alternative {
  transcript: string;
  confidence: number;
  words: WordBase[];
  summaries?: Summary[];
  paragraphs?: ParagraphGroup;
  entities?: Entity[];
  translations?: Translation[];
  topics?: TopicGroup[];
}

interface Channel {
  search?: Search[];
  alternatives: Alternative[];
  detected_language?: string;
  language_confidence?: number;
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
  models: string[];
  model_info: Record<string, ModelInfo>;
  warnings?: Warning[];
}

interface ModelInfo {
  name: string;
  version: string;
  arch: string;
}

interface Paragraph {
  sentences: Sentence[];
  start: number;
  end: number;
  num_words: number;
}

interface ParagraphGroup {
  transcript: string;
  paragraphs: Paragraph[];
}

interface Result {
  channels: Channel[];
  utterances?: Utterance[];
  summary?: TranscriptionSummary;
}

interface Search {
  query: string;
  hits: Hit[];
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
  topics: Topic[];
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
  words: WordBase[];
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
