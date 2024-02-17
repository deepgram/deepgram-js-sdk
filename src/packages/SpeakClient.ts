import { AbstractRestfulClient } from "./AbstractRestfulClient";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import { appendSearchParams, isTextSource } from "../lib/helpers";
import { Fetch, SpeakSchema, TextSource } from "../lib/types";
import { DeepgramSpeakResponse } from "../lib/types/DeepgramSpeakResponse";

export class SpeakClient extends AbstractRestfulClient {
  /**
   * @see https://developers.deepgram.com/reference/text-to-speech-preview-api
   */
  async stream(
    source: TextSource,
    options?: SpeakSchema,
    endpoint = "v1/speak"
  ): Promise<DeepgramSpeakResponse> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const speakOptions: SpeakSchema = { ...{ model: "alpha-asteria-en" }, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, speakOptions);

      return await this.post(this.fetch as Fetch, url, body);
    } catch (error) {
      if (isDeepgramError(error)) {
        return { error };
      }

      throw error;
    }
  }
}
