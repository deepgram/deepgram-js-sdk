import { DefaultOptions } from "../constants";
import { validateOptions } from "../helpers";
import { Transcriber } from "./transcription";

export class Deepgram {
  private _apiUrl: string;
  private _apiKey: string;

  transcription: Transcriber;

  constructor(apiKey: string, apiUrl?: string) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || DefaultOptions.apiUrl;

    /**
     * Ensures that the provided options were provided
     */
    validateOptions(this._apiKey, this._apiUrl);

    this.transcription = new Transcriber(this._apiKey, this._apiUrl);
  }
}
