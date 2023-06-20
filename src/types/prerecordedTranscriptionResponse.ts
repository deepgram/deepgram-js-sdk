import { Metadata } from "./metadata";
import { Channel } from "./channel";
import { Utterance } from "./utterance";
import { secondsToTimestamp } from "../helpers";
import { WordBase } from "./wordBase";

export class PrerecordedTranscriptionResponse {
  err_code?: string;
  err_msg?: string;
  request_id?: string;
  metadata?: Metadata;
  results?: {
    channels: Array<Channel>;
    utterances?: Array<Utterance>;
  };

  /**
   * Returns a VTT formatted string based on the transcription response.
   * @param {number} lineLength The maximum line length. Default: 8
   * @returns {string}
   */
  public toWebVTT(lineLength = 8): string {
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

        limitedLines.push(
          `${secondsToTimestamp(firstWord.start)} --> ${secondsToTimestamp(
            lastWord.end
          )}`
        );
        limitedLines.push(
          words.map((word) => word.punctuated_word ?? word.word).join(" ")
        );
        limitedLines.push("");
      });

      return limitedLines.join("\n");
    };

    this.results.utterances.forEach((utterance) => {
      lines.push(limitedUtterance(utterance, lineLength));
    });

    return lines.join("\n");
  }

  /**
   * Returns a SRT formatted string based on the transcription response.
   * @param {number} lineLength The maximum line length. Default: 8
   * @returns {string}
   */
  public toSRT(lineLength = 8): string {
    if (!this.results || !this.results.utterances) {
      throw new Error(
        "This function requires a transcript that was generated with the utterances feature."
      );
    }

    const lines: string[] = [];

    const chunk = (arr: any[], length: number) => {
      const res: any[] = [];

      for (let i = 0; i < arr.length; i += length) {
        const chunkarr = arr.slice(i, i + length);
        res.push(chunkarr);
      }

      return res;
    };

    let entry = 1;

    const limitedUtterance = (utterance: Utterance, length: number): string => {
      const wordChunks = chunk(utterance.words, length);
      const limitedLines: string[] = [];

      wordChunks.forEach((words: WordBase[]) => {
        const firstWord = words[0];
        const lastWord = words[words.length - 1];

        limitedLines.push((entry++).toString());
        limitedLines.push(
          `${secondsToTimestamp(
            firstWord.start,
            "HH:mm:ss,SSS"
          )} --> ${secondsToTimestamp(lastWord.end, "HH:mm:ss,SSS")}`
        );
        limitedLines.push(
          words.map((word) => word.punctuated_word ?? word.word).join(" ")
        );
        limitedLines.push("");
      });

      return limitedLines.join("\n");
    };

    this.results.utterances.forEach((utterance) => {
      lines.push(limitedUtterance(utterance, lineLength));
    });

    return lines.join("\n");
  }
}
