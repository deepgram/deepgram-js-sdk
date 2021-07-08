import {
  LiveTranscriptionOptions,
  PrerecordedTranscriptionOptions,
  TranscriptionResponse,
  TranscriptionSource,
} from "../types";
import { LiveTranscription } from "./liveTranscription";
import { preRecordedTranscription } from "./preRecordedTranscription";

export class Transcriber {
  constructor(private _credentials: string, private _apiUrl: string) {}

  /**
   * Transcribes prerecorded audio from a file or buffer
   * @param source Url or Buffer of file to transcribe
   * @param options Options to modify transcriptions
   */
  async preRecorded(
    source: TranscriptionSource,
    options?: PrerecordedTranscriptionOptions
  ): Promise<TranscriptionResponse> {
    return await preRecordedTranscription(
      this._credentials,
      this._apiUrl || "",
      source,
      options
    );
  }

  /**
   * Opens a websocket to Deepgram's API for live transcriptions
   * @param options Options to modify transcriptions
   */
  live(options?: LiveTranscriptionOptions): LiveTranscription {
    return new LiveTranscription(
      this._credentials,
      this._apiUrl || "",
      options
    );
  }
}
