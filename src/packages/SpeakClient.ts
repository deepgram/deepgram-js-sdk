import { AbstractRestfulClient } from "./AbstractRestfulClient";
import { DeepgramError, DeepgramUnknownError, isDeepgramError } from "../lib/errors";
import { appendSearchParams, isTextSource } from "../lib/helpers";
import { Fetch, SpeakSchema, TextSource } from "../lib/types";

export class SpeakClient extends AbstractRestfulClient {
  public result: undefined | Response;

  /**
   * @see https://developers.deepgram.com/reference/text-to-speech-api
   */
  async request(
    source: TextSource,
    options?: SpeakSchema,
    endpoint = "v1/speak"
  ): Promise<SpeakClient> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const speakOptions: SpeakSchema = { ...{ model: "aura-asteria-en" }, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, speakOptions);
      this.result = await this._handleRawRequest(this.fetch as Fetch, "POST", url, {}, {}, body);
      return this;
    } catch (error) {
      throw error;
    }
  }

  async getStream(): Promise<ReadableStream<Uint8Array> | null> {
    if (!this.result)
      throw new DeepgramUnknownError("Tried to get stream before making request", "");

    return this.result.body;
  }

  async getHeaders(): Promise<Headers> {
    if (!this.result)
      throw new DeepgramUnknownError("Tried to get headers before making request", "");

    return this.result.headers;
  }
}
