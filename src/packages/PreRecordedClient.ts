// import { LiveClient } from "./LiveClient";
// import WebSocket from "isomorphic-ws";
import { AbstractRestfulClient } from "./AbstractRestfulClient";
import {
  appendSearchParams,
  isBufferSource,
  isReadStreamSource,
  isUrlSource,
} from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type { AsyncPrerecordedResponse } from "../lib/types/AsyncPrerecordedResponse";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";
import type { Fetch } from "../lib/types/Fetch";
import type { FileSource, UrlSource } from "../lib/types/PrerecordedSource";
import type { PrerecordedOptions } from "../lib/types/TranscriptionOptions";
import type { Readable } from "stream";
import type { SyncPrerecordedResponse } from "../lib/types/SyncPrerecordedResponse";

export class PrerecordedClient extends AbstractRestfulClient {
  async transcribeUrl(
    source: UrlSource,
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    try {
      const body = this._getPrerecordedUrlBody(source);

      return await this._makeSyncPrerecordedRequest(options, endpoint, body);
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
      this._setFileMimetypeHeaders(source);

      const body = this._getPrerecordedFileBody(source);

      return await this._makeSyncPrerecordedRequest(options, endpoint, body);
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
      const body = this._getPrerecordedUrlBody(source);

      return await this._makeAsyncPrerecordedRequest(options, callback, endpoint, body);
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
      this._setFileMimetypeHeaders(source);

      const body = this._getPrerecordedFileBody(source);

      return await this._makeAsyncPrerecordedRequest(options, callback, endpoint, body);
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  private _setFileMimetypeHeaders(source: FileSource): void {
    if (source.mimetype === undefined || source.mimetype.length === 0) {
      throw new DeepgramError("Mimetype must be provided if the source is a Buffer or a Readable");
    }

    this.headers["Content-Type"] = source.mimetype;
  }

  private _getPrerecordedUrlBody(source: UrlSource): string {
    let body;
    if (isUrlSource(source)) {
      body = JSON.stringify(source);
    } else {
      throw new DeepgramError("Unknown transcription source type");
    }

    return body;
  }

  private _getPrerecordedFileBody(source: FileSource): Buffer | Readable {
    let body;
    if (isBufferSource(source)) {
      body = source.buffer;
    } else if (isReadStreamSource(source)) {
      body = source.stream;
    } else {
      throw new DeepgramError("Unknown transcription source type");
    }

    return body;
  }

  private async _makeSyncPrerecordedRequest(
    options: PrerecordedOptions | undefined,
    endpoint: string,
    body: string | Buffer | Readable
  ): Promise<DeepgramResponse<SyncPrerecordedResponse>> {
    if (options !== undefined && "callback" in options) {
      throw new DeepgramError(
        "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
      );
    }

    const transcriptionOptions: PrerecordedOptions = { ...{}, ...options };

    // todo: we should pass the url and params/options to the abstract requester, so it can decide which protocol to use with fetch options
    const url = this.url;
    url.pathname = endpoint;
    appendSearchParams(url.searchParams, transcriptionOptions);

    const result: SyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
      headers: this.headers,
    });

    return { result, error: null };
  }

  private async _makeAsyncPrerecordedRequest(
    options: PrerecordedOptions | undefined,
    callback: string,
    endpoint: string,
    body: string | Buffer | Readable
  ): Promise<DeepgramResponse<AsyncPrerecordedResponse>> {
    const transcriptionOptions: PrerecordedOptions = { ...options, ...{ callback } };

    // todo: we should pass the url and params/options to the abstract requester, so it can decide which protocol to use with fetch options
    const url = this.url;
    url.pathname = endpoint;
    appendSearchParams(url.searchParams, transcriptionOptions);

    const result: AsyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
      headers: this.headers,
    });

    return { result, error: null };
  }
}
