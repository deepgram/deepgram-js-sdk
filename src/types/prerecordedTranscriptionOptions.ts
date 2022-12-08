import { Models } from "../enums";

/**
 * Options for transcription
 */
export type PrerecordedTranscriptionOptions = {
  /**
   * AI model used to process submitted audio.
   * @default general
   * @remarks Possible values are general, phonecall, meeting or a custom string
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/model
   */
  model?: Models | string;

  /**
   * Version of the model to use.
   * @default latest
   * @remarks latest OR <version_id>
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/version
   */
  version?: string;

  /**
   * Tier of the model to use.
   * @default base
   * @remarks Possible values are base or enhanced
   * @see https://developers.deepgram.com/documentation/features/tier/
   */
  tier?: string;

  /**
   * Terms or phrases to search for in the submitted audio and replace
   * @remarks Can send multiple instances in query string replace=this:that&replace=thisalso:thatalso. Replacing a term or phrase with nothing will remove the term or phrase from the audio transcript.
   * @see https://developers.deepgram.com/documentation/features/replace/
   */
  replace?: string;

  /**
   * BCP-47 language tag that hints at the primary spoken language.
   * @default en-US
   * @remarks Possible values are en-GB, en-IN, en-NZ, en-US, es, fr, ko, pt,
   * pt-BR, ru, tr or null
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/language
   */
  language?: string;

  /**
   * Indicates whether to add punctuation and capitalization to the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/punctuate
   */
  punctuate?: boolean;

  /**
   * Indicates whether to remove profanity from the transcript.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/profanity_filter
   */
  profanity_filter?: boolean;

  /**
   * Indicates whether to redact sensitive information, replacing redacted content with asterisks (*).
   * @remarks Options include:
   *  `pci`: Redacts sensitive credit card information, including credit card number, expiration date, and CVV
   *  `numbers` (or `true)`: Aggressively redacts strings of numerals
   *  `ssn` (*beta*): Redacts social security numbers
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/redact
   */
  redact?: Array<string>;

  /**
   * Indicates whether to recognize speaker changes. When passed in, each word
   * in the transcript will be assigned a speaker number starting at 0.
   * If 'true' is passed, the latest version of the diarizer  will be used.
   * To use an old version of the diarizer, pass in the version in the `diarize_version` option.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/diarize
   */
  diarize?: boolean;

  /**
   * Indicates which version of the diarizer to use. When passed in, each word
   * in the transcript will be assigned a speaker number starting at 0.
   * Ex: YYYY-MM-DD.X where YYYY-MM-DD is the version date and X is the version number.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/diarize
   */
  diarize_version?: string;

  /**
   * Indicates whether to transcribe each audio channel independently. When set
   * to true, you will receive one transcript for each channel, which means you
   * can apply a different model to each channel using the model parameter (e.g.,
   * set model to general:phonecall, which applies the general model to channel
   * 0 and the phonecall model to channel 1).
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/multichannel
   */
  multichannel?: boolean;

  /**
   * Maximum number of transcript alternatives to return. Just like a human listener,
   * Deepgram can provide multiple possible interpretations of what it hears.
   * @default 1
   */
  alternatives?: number;

  /**
   * Indicates whether to convert numbers from written format (e.g., one) to
   * numerical format (e.g., 1). Deepgram can format numbers up to 999,999.
   * @remarks Converted numbers do not include punctuation. For example,
   * 999,999 would be transcribed as 999999.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/numerals
   */
  numbers?: boolean;

  /**
   * Same as numbers. Is the old name for the option. Will eventually be deprecated
   */
  numerals?: boolean;

  /**
   * adds spaces between numbers in the transcript
   */
  numbers_spaces?: boolean;

  /**
   * Terms or phrases to search for in the submitted audio. Deepgram searches
   * for acoustic patterns in audio rather than text patterns in transcripts
   * because we have noticed that acoustic pattern matching is more performant.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/search
   */
  search?: Array<string>;

  /**
   * Callback URL to provide if you would like your submitted audio to be
   * processed asynchronously. When passed, Deepgram will immediately respond
   * with a request_id. When it has finished analyzing the audio, it will send
   * a POST request to the provided URL with an appropriate HTTP status code.
   * @remarks You may embed basic authentication credentials in the callback URL.
   * Only ports 80, 443, 8080, and 8443 can be used for callbacks.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/callback
   */
  callback?: string;

  /**
   * Keywords to which the model should pay particular attention to boosting
   * or suppressing to help it understand context. Just like a human listener,
   * Deepgram can better understand mumbled, distorted, or otherwise
   * hard-to-decipher speech when it knows the context of the conversation.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/keywords
   */
  keywords?: Array<string>;

  /**
   * Indicates whether Deepgram will segment speech into meaningful semantic
   * units, which allows the model to interact more naturally and effectively
   * with speakers' spontaneous speech patterns. For example, when humans
   * speak to each other conversationally, they often pause mid-sentence to
   * reformulate their thoughts, or stop and restart a badly-worded sentence.
   * When utterances is set to true, these utterances are identified and
   * returned in the transcript results.
   *
   * By default, when utterances is enabled, it starts a new utterance after
   * 0.8 s of silence. You can customize the length of time used to determine
   * where to split utterances by submitting the utt_split parameter.
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/utterances
   */
  utterances?: boolean;

  /**
   * Length of time in seconds of silence between words that Deepgram will
   * use when determining where to split utterances. Used when utterances
   * is enabled.
   * @default 0.8 seconds
   * @see https://developers.deepgram.com/api-reference/speech-recognition-api#operation/transcribeAudio/properties/utt_split
   */
  utt_split?: number;

  /**
   * Detects the language of the recorded audio and passes audio through appropriate model
   *
   *
   * @see https://developers.deepgram.com/api-reference/#detect-language-pr
   */
  detect_language?: boolean;

  /**
   * Indicates whether Deepgram will split audio into paragraphs to improve transcript
   * readability. When paragraphs is set to true, you must also set either punctuate,
   * diarize, or multichannel to true.
   */
  paragraphs?: boolean;

  /**
   * Indicates whether Deepgram will Identify and detect entities in the transcript
   */
  detect_entities?: boolean;

  /**
   * Indicates whether Deepgram should provide summarizations of sections of the provided audio.
   */
  summarize?: boolean;

  /**
   * Corresponds to the language code Deepgram will translate the results into
   * For example, 'es', 'fr', 'ja'
   * If requests translation in the same language as their ASR request, a 400 will be returned.
   */
  translate?: Array<string>;

  /**
   * Indicates whether Deepgram will identify and detect topics in the transcript.
   */
  detect_topics?: boolean;

  /**
   * Indicates whether Deepgram will identify sentiment in the transcript.
   */
  analyze_sentiment?: boolean;

  /**
   * Indicates the confidence requirement for non-neutral sentiment.
   * Setting this variable turns sentiment analysis on.
   */
  sentiment_threshold?: number;

  /**
   * Indicates whether to convert dates from written format (e.g., january first) to
   * numerical format (e.g., 01-01).
   */
  dates?: boolean;

  /**
   * Indicates the format the dates will be converted to. Requires dates to be turned on.
   * Format string is specified using chrono strftime notation https://docs.rs/chrono/latest/chrono/format/strftime/index.html   *
   * @example %Y-%m-%d
   */
  date_format?: string;

  /**
   * Indicates whether to convert times from written format (e.g., three oclock) to
   * numerical format (e.g., 3:00).
   * 	*/
  times: boolean;

  /**
   * Option to format punctuated commands
   * Before - “i went to the store period new paragraph then i went home”
   * After - “i went to the store. <\n> then i went home”
   */
  dictation?: boolean;

  /**
   * Option to format measurements in the transcript
   * */
  measurements?: boolean;
};
