import { DefaultOptions } from "../constants";

import { Transcriber } from "./transcription";

export class Deepgram {
  private _apiUrl: string;
  private _apiKey: string;

  transcription: Transcriber;

  constructor(apiKey: string, apiUrl?: string) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || DefaultOptions.apiUrl;

    this._validateOptions();

    this.transcription = new Transcriber(this._apiKey, this._apiUrl);
  }

  /**
   * Ensures that the provided options were provided
   */
  private _validateOptions() {
    if (!this._apiKey || this._apiKey.trim().length === 0) {
      throw new Error("DG: API key is required");
    }

    if (!this._apiUrl || this._apiUrl.trim().length === 0) {
      throw new Error("DG: API url should be a valid url or not provided");
    }
  }
}
