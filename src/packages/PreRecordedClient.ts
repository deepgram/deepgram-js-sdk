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
import type { Fetch } from "../lib/types/Fetch";
import type { FileSource, UrlSource } from "../lib/types/PrerecordedSource";
import type { PrerecordedOptions } from "../lib/types/TranscriptionOptions";
import type { Readable } from "stream";
import type { SyncPrerecordedResponse } from "../lib/types/SyncPrerecordedResponse";
import type { AsyncPrerecordedResponse } from "../lib/types/AsyncPrerecordedResponse";

export class PrerecordedClient extends AbstractRestfulClient {
  async transcribeUrl(
    source: UrlSource,
    options?: PrerecordedOptions,
    endpoint = "v1/listen"
  ): Promise<
    | {
        result: SyncPrerecordedResponse;
        error: null;
      }
    | {
        result: null;
        error: DeepgramError;
      }
  > {
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
  ): Promise<
    | {
        result: SyncPrerecordedResponse;
        error: null;
      }
    | {
        result: null;
        error: DeepgramError;
      }
  > {
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
  ): Promise<
    | {
        result: AsyncPrerecordedResponse;
        error: null;
      }
    | {
        result: null;
        error: DeepgramError;
      }
  > {
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
  ): Promise<
    | {
        result: AsyncPrerecordedResponse;
        error: null;
      }
    | {
        result: null;
        error: DeepgramError;
      }
  > {
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

  private _setFileMimetypeHeaders(source: FileSource) {
    if (source.mimetype === undefined || source.mimetype.length === 0) {
      throw new DeepgramError("Mimetype must be provided if the source is a Buffer or a Readable");
    }

    this.headers["Content-Type"] = source.mimetype;
  }

  private _getPrerecordedUrlBody(source: UrlSource) {
    let body;
    if (isUrlSource(source)) {
      body = JSON.stringify(source);
    } else {
      throw new DeepgramError("Unknown transcription source type");
    }

    return body;
  }

  private _getPrerecordedFileBody(source: FileSource) {
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
  ) {
    if (options !== undefined && "callback" in options) {
      throw new DeepgramError(
        "Callback cannot be provided as an option to a synchronous transcription. Use `asyncPrerecordedUrl` or `asyncPrerecordedFile` instead."
      );
    }

    const transcriptionOptions: PrerecordedOptions = { ...{}, ...options };

    // todo: we should pass the url and params/options to the abstract requester, so it can decide which protocol to use with fetch options
    const url = this.url;
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
  ) {
    const transcriptionOptions: PrerecordedOptions = { ...options, ...{ callback } };

    // todo: we should pass the url and params/options to the abstract requester, so it can decide which protocol to use with fetch options
    const url = this.url;
    appendSearchParams(url.searchParams, transcriptionOptions);

    const result: AsyncPrerecordedResponse = await this.post(this.fetch as Fetch, url, body, {
      headers: this.headers,
    });

    return { result, error: null };
  }
}
