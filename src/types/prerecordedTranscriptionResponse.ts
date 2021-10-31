import { Metadata } from "./metadata";
import { Channel } from "./channel";
import { Utterance } from "./utterance";
import { secondsToTimestamp } from "../helpers";

export class PrerecordedTranscriptionResponse {
  request_id?: string;
  metadata?: Metadata;
  results?: {
    channels: Array<Channel>;
    utterances?: Array<Utterance>;
  };

  /**
   * Converts the transcription to the WebVTT format
   * @remarks In order to translate the transcription to WebVTT, the utterances
   * feature must be used.
   * @returns A string with the transcription in the WebVTT format
   */
  public toWebVTT(): string {
    let webVTT = `WEBVTT\n\n`;

    webVTT += `NOTE\nTranscription provided by Deepgram\nRequest Id: ${this.metadata?.request_id}\nCreated: ${this.metadata?.created}\nDuration: ${this.metadata?.duration}\nChannels: ${this.metadata?.channels}\n\n`;  

    if (this.results?.utterances) {
      for (let i = 0; i < this.results.utterances.length; i++) {
        const utterance = this.results.utterances[i];
        const start = secondsToTimestamp(utterance.start);
        const end = secondsToTimestamp(utterance.end);
        webVTT += `${i + 1}\n${start} --> ${end}\n- ${
          utterance.transcript
        }\n\n`;
      }
    }

    return webVTT;
  }

  /**
   * Converts the transcription to the SRT format
   * @remarks In order to translate the transcription to SRT, the utterances
   * feature must be used.
   * @returns A string with the transcription in the SRT format
   */
  public toSRT(): string {
    let srt = "";

    if (this.results?.utterances) {
      for (let i = 0; i < this.results.utterances.length; i++) {
        const utterance = this.results.utterances[i];
        const start = secondsToTimestamp(utterance.start).replace(".", ",");
        const end = secondsToTimestamp(utterance.end).replace(".", ",");
        srt += `${i + 1}\n${start} --> ${end}\n${utterance.transcript}\n\n`;
      }
    }

    return srt;
  }
}
