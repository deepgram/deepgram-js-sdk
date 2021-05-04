import { DefaultOptions } from "./constants";
import {
  ApiBatchResponse,
  ApiKeyResponse,
  Key,
  Options,
  TranscriptionOptions,
} from "./types";
import { transcribe } from "./batch";
import { Keys } from "./keys";

export class Deepgram {
  private _credentials: string;

  constructor(private options: Options) {
    this._validateOptions();

    this._credentials = Buffer.from(
      `${options.apiKey}:${options.apiSecret}`
    ).toString("base64");
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

  /**
   * Transcribes audio from a file or buffer
   * @param source Url or Buffer of file to transcribe
   * @param options Options to modify transcriptions
   */
  async transcribe(
    source: string | Buffer,
    options?: TranscriptionOptions
  ): Promise<ApiBatchResponse> {
    return await transcribe(
      this._credentials,
      this.options.apiUrl || "",
      source,
      options
    );
  }

  public keys = {
    list: async (): Promise<ApiKeyResponse> => {
      return await Keys.list(this._credentials, this.options.apiUrl || "");
    },

    create: async (label: string): Promise<Key> => {
      return await Keys.create(
        this._credentials,
        this.options.apiUrl || "",
        label
      );
    },

    delete: async (key: string): Promise<void> => {
      return await Keys.delete(
        this._credentials,
        this.options.apiUrl || "",
        key
      );
    },
  };
}
