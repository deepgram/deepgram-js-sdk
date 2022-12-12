export type UsageOptions = {
  start?: string;
  end?: string;
  accessor?: string;
  tag?: Array<string>;
  method?: "sync" | "async" | "streaming";
  model?: string;
  multichannel?: boolean;
  interim_results?: boolean;
  punctuate?: boolean;
  ner?: boolean;
  utterances?: boolean;
  replace?: boolean;
  profanity_filter?: boolean;
  keywords?: boolean;
  sentiment?: boolean;
  diarize?: boolean;
  detect_language?: boolean;
  search?: boolean;
  redact?: boolean;
  alternatives?: boolean;
  numerals?: boolean;
  numbers?: boolean;
  translation?: boolean;
  detect_entities?: boolean;
  detect_topics?: boolean;
  summarize?: boolean;
  paragraphs?: boolean;
  utt_split?: boolean;
  analyze_sentiment?: boolean;
  sent_thresh?: boolean;
  smart_format?: boolean;
};
