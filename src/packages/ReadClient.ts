import { CallbackUrl, appendSearchParams, isTextSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  AnalyzeSchema,
  AsyncAnalyzeResponse,
  DeepgramResponse,
  Fetch,
  PrerecordedSchema,
  SyncAnalyzeResponse,
  TextSource,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

export class ReadClient extends AbstractRestClient {
  public namespace: string = "read";

  async analyzeUrl(
    source: UrlSource,
    options?: AnalyzeSchema,
    endpoint = ":version/read"
  ): Promise<DeepgramResponse<SyncAnalyzeResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncAnalyzeResponse = await this.post(this.fetch as Fetch, requestUrl, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async analyzeText(
    source: TextSource,
    options?: AnalyzeSchema,
    endpoint = ":version/read"
  ): Promise<DeepgramResponse<SyncAnalyzeResponse>> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous requests. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncAnalyzeResponse = await this.post(this.fetch as Fetch, requestUrl, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: AnalyzeSchema,
    endpoint = ":version/read"
  ): Promise<DeepgramResponse<AsyncAnalyzeResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncAnalyzeResponse = await this.post(this.fetch as Fetch, requestUrl, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  async analyzeTextCallback(
    source: TextSource,
    callback: CallbackUrl,
    options?: AnalyzeSchema,
    endpoint = ":version/read"
  ): Promise<DeepgramResponse<AsyncAnalyzeResponse>> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncAnalyzeResponse = await this.post(this.fetch as Fetch, requestUrl, body, {
        "Content-Type": "deepgram/audio+video",
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
