import { AbstractRestfulClient } from "./AbstractRestfulClient";
import { CallbackUrl, appendSearchParams, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  AsyncPrerecordedResponse,
  DeepgramResponse,
  Fetch,
  FileSource,
  PrerecordedSchema,
  SyncPrerecordedResponse,
  UrlSource,
} from "../lib/types";

export class PrerecordedClient extends AbstractRestfulClient {
  async transcribeUrl(
    source: UrlSource,
    options?: PrerecordedSchema,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      this.headers["Content-Type"] = "application/json";

      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
        );
      }

      const transcriptionOptions: PrerecordedSchema = { ...{}, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: SyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
        headers: this.headers,
      });

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async transcribeFile(
    source: FileSource,
    options?: PrerecordedSchema,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      // deepgram ignores the mimetype if it's not `application/json`
      this.headers["Content-Type"] = "deepgram/audio+video";

      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
        );
      }

      const transcriptionOptions: PrerecordedSchema = { ...{}, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: SyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
        headers: this.headers,
      });

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async transcribeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: PrerecordedSchema,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      this.headers["Content-Type"] = "application/json";

      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const transcriptionOptions: PrerecordedSchema = {
        ...options,
        ...{ callback: callback.toString() },
      };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: AsyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
        headers: this.headers,
      });

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async transcribeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: PrerecordedSchema,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      // deepgram ignores the mimetype if it's not `application/json`
      this.headers["Content-Type"] = "deepgram/audio+video";

      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const transcriptionOptions: PrerecordedSchema = {
        ...options,
        ...{ callback: callback.toString() },
      };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: AsyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
        headers: this.headers,
      });

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
