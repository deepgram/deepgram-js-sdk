import { AbstractRestfulClient } from "./AbstractRestfulClient";
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

export class ReadClient extends AbstractRestfulClient {
  async analyzeUrl(
    source: UrlSource,
    options?: AnalyzeSchema,
    endpoint = "v1/read"
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

      const analyzeOptions: AnalyzeSchema = { ...{}, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, analyzeOptions);

      const result: SyncAnalyzeResponse = await this.post(this.fetch as Fetch, url, body);

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
    endpoint = "v1/read"
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

      const analyzeOptions: AnalyzeSchema = { ...{}, ...options };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, analyzeOptions);

      const result: SyncAnalyzeResponse = await this.post(this.fetch as Fetch, url, body);

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
    endpoint = "v1/read"
  ): Promise<DeepgramResponse<AsyncAnalyzeResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      const transcriptionOptions: PrerecordedSchema = {
        ...options,
        ...{ callback: callback.toString() },
      };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: AsyncAnalyzeResponse = await this.post(this.fetch as Fetch, url, body);

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
    endpoint = "v1/read"
  ): Promise<DeepgramResponse<AsyncAnalyzeResponse>> {
    try {
      let body;

      if (isTextSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown source type");
      }

      const transcriptionOptions: PrerecordedSchema = {
        ...options,
        ...{ callback: callback.toString() },
      };

      const url = new URL(endpoint, this.baseUrl);
      appendSearchParams(url.searchParams, transcriptionOptions);

      const result: AsyncAnalyzeResponse = await this.post(this.fetch as Fetch, url, body, {
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
