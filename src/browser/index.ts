import { DefaultOptions } from "../constants";
import { validateOptions } from "../helpers";
import { Transcriber } from "./transcription";
import { Keys } from "../keys";
import { _request } from "./httpFetch";

export class Deepgram {
  private _apiUrl: string;
  private _apiKey: string;

  transcription: Transcriber;
  keys: Keys;

  constructor(apiKey: string, apiUrl?: string) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || DefaultOptions.apiUrl;

    /**
     * Ensures that the provided options were provided
     */
    validateOptions(this._apiKey, this._apiUrl);

    this.transcription = new Transcriber(this._apiKey, this._apiUrl);
    this.keys = new Keys(this._apiKey, this._apiUrl, _request);
  }
}
