export type UsageRequestDetail = {
  details: {
    usd: number;
    duration: number;
    total_audio: number;
    channels: number;
    streams: number;
    model: string;
    method: "sync" | "async" | "streaming";
    tags: Array<string>;
    features: Array<string>;
    config: {
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
    };
  };
};
