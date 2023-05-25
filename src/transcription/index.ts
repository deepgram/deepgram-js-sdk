import {
  LiveTranscriptionOptions,
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  TranscriptionSource,
  ErrorResponse,
} from "../types";
import { LiveTranscription } from "./liveTranscription";
import { preRecordedTranscription } from "./preRecordedTranscription";

export { LiveTranscriptionOptions, PrerecordedTranscriptionOptions };

export class Transcriber {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean
  ) {}

  /**
   * Transcribes prerecorded audio from a file or buffer.
   * @param {TranscriptionSource} source Source of audio to transcribe
   * @param {PrerecordedTranscriptionOptions} options Options used to toggle transcription features
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<PrerecordedTranscriptionResponse | ErrorResponse>}
   */
  async preRecorded(
    source: TranscriptionSource,
    options?: PrerecordedTranscriptionOptions,
    endpoint?: string
  ): Promise<PrerecordedTranscriptionResponse | ErrorResponse> {
    return await preRecordedTranscription(
      this._credentials,
      this._apiUrl || "",
      this._requireSSL,
      source,
      options,
      endpoint
    );
  }

  /**
   * Opens a websocket to Deepgram's API for live transcriptions
   * @param {LiveTranscriptionOptions} options Options used to toggle transcription features
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {LiveTranscription | ErrorResponse}
   */
  live(
    options?: LiveTranscriptionOptions,
    endpoint?: string
  ): LiveTranscription | ErrorResponse {
    return new LiveTranscription(
      this._credentials,
      this._apiUrl || "",
      this._requireSSL,
      options,
      endpoint
    );
  }
}
