export interface SyncPrerecordedResponse {
  metadata: Metadata;
  results: Result;
}

interface Result {
  channels: Channel[];
  utterances?: Utterance[];
  summary?: TranscriptionSummary;
  sentiments?: Sentiment;
  topics?: Topics;
  intents?: Intents;
}

interface Channel {
  alternatives: Alternative[];
  search?: Search[];
  detected_language?: string;
  language_confidence?: number;
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

interface TranscriptionSummary {
  result: string;
  short: string;
}

interface Sentiment {
  segments?: SentimentSegment[];
  average?: Average;
}

interface Topics {
  segments?: TopicsSegment[];
}

interface Intents {
  segments?: IntentsSegment[];
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

interface Search {
  query: string;
  hits: Hit[];
}

interface WordBase {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
  speaker?: number;
  speaker_confidence?: number;
  sentiment: string;
  sentiment_score: number;
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

interface Warning {
  parameter: string;
  type: string;
  message: string;
}

interface SentimentSegment {
  text: string;
  start_word: number;
  end_word: number;
  sentiment: "positive" | "neutral" | "negative";
  sentiment_score: number;
}

interface Average {
  sentiment: string;
  sentiment_score: number;
}

interface TopicsSegment {
  text: string;
  start_word: number;
  end_word: number;
  topics: { topic: string; confidence_score: number }[];
}

interface IntentsSegment {
  text: string;
  start_word: number;
  end_word: number;
  intents: { intent: string; confidence_score: number }[];
}
