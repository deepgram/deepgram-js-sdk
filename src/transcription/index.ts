import {
  LiveTranscriptionOptions,
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  TranscriptionSource,
} from "../types";
import { LiveTranscription } from "./liveTranscription";
import { preRecordedTranscription } from "./preRecordedTranscription";

export class Transcriber {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean
  ) {}

  /**
   * Transcribes prerecorded audio from a file or buffer
   * @param source Url or Buffer of file to transcribe
   * @param options Options to modify transcriptions
   */
  async preRecorded(
    source: TranscriptionSource,
    options?: PrerecordedTranscriptionOptions,
    endpoint: string = "v1/listen"
  ): Promise<PrerecordedTranscriptionResponse> {
    return await preRecordedTranscription(
      this._credentials,
      this._apiUrl || "",
      this._requireSSL,
      source,
      endpoint,
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
      this._requireSSL,
      options
    );
  }
}
