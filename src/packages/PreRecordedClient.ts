import { AbstractRestfulClient } from "./AbstractRestfulClient";
import {
  appendSearchParams,
  isBufferSource,
  isReadStreamSource,
  isUrlSource,
} from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  AsyncPrerecordedResponse,
  DeepgramResponse,
  Fetch,
  FileSource,
  PrerecordedOptions,
  SyncPrerecordedResponse,
  UrlSource,
} from "../lib/types";

export class PrerecordedClient extends AbstractRestfulClient {
  async transcribeUrl(
    source: UrlSource,
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
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
          "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
        );
      }

      const transcriptionOptions: PrerecordedOptions = { ...{}, ...options };

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
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      if (source.mimetype === undefined || source.mimetype.length === 0) {
        throw new DeepgramError(
          "Mimetype must be provided if the source is a Buffer or a Readable"
        );
      }

      this.headers["Content-Type"] = source.mimetype;

      let body;
      if (isBufferSource(source)) {
        body = source.buffer;
      } else if (isReadStreamSource(source)) {
        body = source.stream;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
        );
      }

      const transcriptionOptions: PrerecordedOptions = { ...{}, ...options };

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
    callback: string,
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      let body;
      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const transcriptionOptions: PrerecordedOptions = { ...options, ...{ callback } };

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
    callback: string,
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    try {
      if (source.mimetype === undefined || source.mimetype.length === 0) {
        throw new DeepgramError(
          "Mimetype must be provided if the source is a Buffer or a Readable"
        );
      }

      this.headers["Content-Type"] = source.mimetype;

      let body;
      if (isBufferSource(source)) {
        body = source.buffer;
      } else if (isReadStreamSource(source)) {
        body = source.stream;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      const transcriptionOptions: PrerecordedOptions = { ...options, ...{ callback } };

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
