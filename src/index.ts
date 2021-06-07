import { DefaultOptions } from "./constants";
import { Options } from "./types";
import { Keys } from "./keys";
import { Projects } from "./projects";
import { Transcriber } from "./transcription";

export class Deepgram {
  private _credentials: string;

  keys: Keys;
  projects: Projects;
  transcription: Transcriber;

  constructor(private options: Options) {
    this._validateOptions();

    this._credentials = Buffer.from(
      `${options.apiKey}:${options.apiSecret}`
    ).toString("base64");

    this.keys = new Keys(this._credentials, this.options.apiUrl || "");
    this.projects = new Projects(this._credentials, this.options.apiUrl || "");
    this.transcription = new Transcriber(
      this._credentials,
      this.options.apiUrl || ""
    );
  }

  /**
   * Ensures that the provided credentials were provided
   */
  private _validateOptions() {
    this.options = { ...DefaultOptions, ...this.options };

    if (
      !this.options.apiKey ||
      this.options.apiKey.trim().length === 0 ||
      !this.options.apiSecret ||
      this.options.apiSecret.trim().length === 0
    ) {
      throw new Error("DG: API key & secret are required");
    }
  }
}
