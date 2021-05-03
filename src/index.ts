import querystring from "querystring";
import { request } from "https";
import { DefaultOptions } from "./constants";
import { ApiResponse, Options, TranscriptionOptions } from "./types";

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
  ): Promise<ApiResponse> {
    const transcriptionOptions = { ...{}, ...options };

    if (
      typeof source !== "string" &&
      transcriptionOptions.mimetype === undefined
    ) {
      throw new Error(
        "DG: Mimetype must be provided if the source is a Buffer"
      );
    }

    return await this._listen(source, transcriptionOptions);
  }

  /**
   *
   */
  async stream(): Promise<unknown> {
    return Promise.resolve("not implemented");
  }

  private async _listen(
    source: string | Buffer,
    options: TranscriptionOptions
  ): Promise<ApiResponse> {
    const requestOptions = {
      host: this.options.apiUrl,
      path: `/v2/listen?${querystring.stringify(options)}`,
      method: "POST",
      headers: {
        "Content-Type":
          typeof source === "string" ? "application/json" : options.mimetype,
        Authorization: `Basic ${this._credentials}`,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const httpRequest = request(requestOptions, (dgRes) => {
          let dgResContent = "";

          dgRes.on("data", (chunk) => {
            dgResContent += chunk;
          });

          dgRes.on("end", () => {
            const dgResJson = JSON.parse(dgResContent);
            if (dgResJson.error) {
              reject(`DG: ${dgResContent}`);
            }
            resolve(dgResJson);
          });

          dgRes.on("error", (err) => {
            reject(`DG: ${err}`);
          });
        });

        httpRequest.on("error", (err) => {
          reject(`DG: ${err}`);
        });

        const payload =
          typeof source === "string" ? JSON.stringify({ url: source }) : source;

        httpRequest.write(payload);
        httpRequest.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
