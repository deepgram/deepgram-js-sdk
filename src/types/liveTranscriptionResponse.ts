import { Channel } from "./channel";

export type LiveTranscriptionResponse = {
  channel_index: Array<number>;
  duration: number;
  start: number;
  is_final: boolean;
  speech_final: boolean;
  channel: Channel;
};
