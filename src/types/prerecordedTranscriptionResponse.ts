import { Metadata } from "./metadata";
import { Channel } from "./channel";
import { Utterance } from "./utterance";
import { secondsToTimestamp } from "../helpers";
import { WordBase } from "./wordBase";

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
  public toWebVTT(length: number = 14): string {
    if (!this.results || !this.results.utterances) {
      throw new Error(
        "This function requires a transcript that was generated with the utterances feature."
      );
    }

    const lines: string[] = [];
    lines.push("WEBVTT");
    lines.push("");
    lines.push("NOTE");
    lines.push("Transcription provided by Deepgram");
    lines.push(`Request Id: ${this.metadata?.request_id}`);
    lines.push(`Created: ${this.metadata?.created}`);
    lines.push(`Duration: ${this.metadata?.duration}`);
    lines.push(`Channels: ${this.metadata?.channels}`);
    lines.push("");

    const chunk = (arr: any[], length: number) => {
      const res: any[] = [];

      for (let i = 0; i < arr.length; i += length) {
        const chunkarr = arr.slice(i, i + length);
        res.push(chunkarr);
      }

      return res;
    };

    const limitedUtterance = (utterance: Utterance, length: number): string => {
      const wordChunks = chunk(utterance.words, length);
      const limitedLines: string[] = [];

      wordChunks.forEach((words: WordBase[]) => {
        const firstWord = words[0];
        const lastWord = words[words.length - 1];

        limitedLines.push(`${firstWord.start} --> ${lastWord.end}`);
        limitedLines.push(
          ...words.map((word) => word.punctuated_word ?? word.word)
        );
      });

      return limitedLines.join("\n");
    };

    this.results.utterances.forEach((utterance) => {
      lines.push(limitedUtterance(utterance, length));
    });

    return lines.join("\n");
  }

  /**
   * Converts the transcription to the SRT format
   * @remarks In order to translate the transcription to SRT, the utterances
   * feature must be used.
   * @returns A string with the transcription in the SRT format
   */
  public toSRT(): string {
    if (!this.results || !this.results.utterances) {
      throw new Error(
        "This function requires a transcript that was generated with the utterances feature."
      );
    }

    let srt = "";

    for (let i = 0; i < this.results.utterances.length; i++) {
      const utterance = this.results.utterances[i];
      const start = secondsToTimestamp(utterance.start).replace(".", ",");
      const end = secondsToTimestamp(utterance.end).replace(".", ",");
      srt += `${i + 1}\n${start} --> ${end}\n${utterance.transcript}\n\n`;
    }

    return srt;
  }
}
