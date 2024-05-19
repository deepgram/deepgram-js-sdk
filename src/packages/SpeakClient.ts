import { DeepgramError, DeepgramUnknownError } from "../lib/errors";
import { isTextSource } from "../lib/helpers";
import { SpeakSchema, TextSource } from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

export class SpeakClient extends AbstractRestClient {
  public namespace: string = "speak";
  public result: undefined | Response;

  /**
   * @see https://developers.deepgram.com/reference/text-to-speech-api
   */
  async request(
    source: TextSource,
    options?: SpeakSchema,
    endpoint = ":version/speak"
  ): Promise<SpeakClient> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...{ model: "aura-asteria-en" }, ...options }
      );
      this.result = await this.post(requestUrl, body, {
        headers: { Accept: "audio/*", "Content-Type": "application/json" },
      });

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
