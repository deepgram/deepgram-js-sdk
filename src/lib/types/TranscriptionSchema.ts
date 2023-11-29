/**
 * Options for transcription
 */
interface TranscriptionSchema extends Record<string, unknown> {
  /**
   * @see https://developers.deepgram.com/docs/model
   */
  model?: string;

  /**
   * @see https://developers.deepgram.com/docs/tier
   */
  tier?: string;

  /**
   * @see https://developers.deepgram.com/docs/version
   */
  version?: string;

  /**
   * @see https://developers.deepgram.com/docs/language
   */
  language?: string;

  /**
   * @see https://developers.deepgram.com/docs/punctuation
   */
  punctuate?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/profanity-filter
   */
  profanity_filter?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/redaction
   */
  redact?: string[] | string | boolean;

  /**
   * @see https://developers.deepgram.com/docs/diarization
   */
  diarize?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/smart-format
   */
  smart_format?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/multichannel
   */
  multichannel?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/numerals
   * @deprecated
   */
  numerals?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/search
   */
  search?: string[] | string;

  /**
   * @see https://developers.deepgram.com/docs/find-and-replace
   */
  replace?: string[] | string;

  /**
   * @see https://developers.deepgram.com/docs/callback
   */
  callback?: string;

  /**
   * @see https://developers.deepgram.com/docs/keywords
   */
  keywords?: string[] | string;

  /**
   * @see https://developers.deepgram.com/docs/tagging
   */
  tag?: string[];

  [key: string]: unknown;
}

interface PrerecordedSchema extends TranscriptionSchema {
  /**
   * @see https://developers.deepgram.com/docs/detect-entities
   */
  detect_entities?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/language-detection
   */
  detect_language?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/topic-detection
   */
  detect_topics?: boolean;

  /**
   * Undocumented feature.
   */
  alternatives?: number;

  /**
   * @see https://developers.deepgram.com/docs/paragraphs
   */
  paragraphs?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/summarization
   */
  summarize?: boolean | string;

  /**
   * @see https://developers.deepgram.com/docs/utterances
   */
  utterances?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/utterance-split
   */
  utt_split?: number;
}

interface LiveSchema extends TranscriptionSchema {
  /**
   * @see https://developers.deepgram.com/docs/channels
   */
  channels?: number;

  /**
   * @see https://developers.deepgram.com/docs/encoding
   */
  encoding?: string;

  /**
   * @see https://developers.deepgram.com/docs/sample-rate
   */
  sample_rate?: number;

  /**
   * @see https://developers.deepgram.com/docs/endpointing
   */
  endpointing?: number;

  /**
   * @see https://developers.deepgram.com/docs/interim-results
   */
  interim_results?: boolean;
}

export type { TranscriptionSchema, PrerecordedSchema, LiveSchema };
