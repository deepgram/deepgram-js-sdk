import {
  LiveTranscriptionOptions,
} from "../../types";
import querystring from "querystring";
export class Transcriber {
  constructor(private _credentials: string, private _apiUrl: string) {}

  /**
   * Opens a websocket to Deepgram's API for live transcriptions
   * @param options Options to modify transcriptions
   */
  live(options?: LiveTranscriptionOptions): WebSocket {
    return new WebSocket(
      `wss://${this._apiUrl}/v1/listen?${querystring.stringify(options)}`,
      ["token", this._credentials]
    );
  }
}
