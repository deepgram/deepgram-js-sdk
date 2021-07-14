import { Metadata } from "./metadata";
import { Channel } from "./channel";
import { Utterance } from "./utterance";

export type PrerecordedTranscriptionResponse = {
  request_id?: string;
  metadata?: Metadata;
  results?: {
    channels: Array<Channel>;
    utterances?: Array<Utterance>;
  };
};
