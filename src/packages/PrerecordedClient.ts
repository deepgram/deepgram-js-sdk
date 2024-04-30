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
import { AbstractRestClient } from "./AbstractRestClient";

export class PrerecordedClient extends AbstractRestClient {
  public namespace: string = "listen";

  async transcribeUrl(
    source: UrlSource,
    options?: PrerecordedSchema,
    endpoint = ":version/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncPrerecordedResponse = await this.post(
        this.fetch as Fetch,
        requestUrl,
        body
      );

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
    endpoint = ":version/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncPrerecordedResponse = await this.post(
        this.fetch as Fetch,
        requestUrl,
        body,
        {
          "Content-Type": "deepgram/audio+video",
        }
      );

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
    endpoint = ":version/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncPrerecordedResponse = await this.post(
        this.fetch as Fetch,
        requestUrl,
        body
      );

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
    endpoint = ":version/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      // const transcriptionOptions: PrerecordedSchema = {
      //   ...options,
      //   ...{ callback: callback.toString() },
      // };

      // const url = new URL(endpoint, this.baseUrl);
      // appendSearchParams(url.searchParams, transcriptionOptions);

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncPrerecordedResponse = await this.post(
        this.fetch as Fetch,
        requestUrl,
        body,
        {
          "Content-Type": "deepgram/audio+video",
        }
      );

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
