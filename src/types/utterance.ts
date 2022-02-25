import { WordBase } from "./wordBase";

export type Utterance = {
  /**
   * Start time (in seconds) from the beginning of the audio stream.
   */
  start: number;
  /**
   * End time (in seconds) from the beginning of the audio stream.
   */
  end: number;
  /**
   * Floating point value between 0 and 1 that indicates overall transcript
   * reliability. Larger values indicate higher confidence.
   */
  confidence: number;
  /**
   * Audio channel to which the utterance belongs. When using multichannel audio,
   * utterances are chronologically ordered by channel.
   */
  channel: number;
  /**
   *  Transcript for the audio segment being processed.
   */
  transcript: string;
  /**
   * Object containing each word in the transcript, along with its start time
   * and end time (in seconds) from the beginning of the audio stream, and a confidence value.
   */
  words: Array<WordBase>;
  /**
   * Integer indicating the predicted speaker of the majority of words
   * in the utterance who is saying the words being processed.
   */
  speaker?: number;
  /**
   * Unique identifier of the utterance
   */
  id: string;
};
