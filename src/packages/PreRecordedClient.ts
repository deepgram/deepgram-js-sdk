import { AbstractRestfulClient } from "./AbstractRestfulClient";
import type {
  BufferSource,
  ReadStreamSource,
  PreRecordedSource,
  UrlSource,
} from "../lib/types/PreRecordedSource";
import type { Fetch } from "../lib/types/Fetch";
import type { PreRecordedOptions } from "../lib/types/TranscriptionOptions";
import type { PreRecordedResponse } from "../lib/types/PreRecordedResponse";
import { DeepgramError, isDeepgramError } from "../lib/errors";

export class PreRecordedClient extends AbstractRestfulClient {
  constructor(apiUrl: string, headers: Record<string, string>, fetch?: Fetch) {
    super(apiUrl, headers, fetch);
  }

  async listen(
    source: PreRecordedSource,
    options?: PreRecordedOptions,
    endpoint = "v1/listen"
  ): Promise<
    | {
        result: PreRecordedResponse;
        error: null;
      }
    | {
        result: null;
        error: DeepgramError;
      }
  > {
    try {
      if (
        !this._isUrlSource(source) &&
        (source.mimetype === undefined || source.mimetype.length === 0)
      ) {
        throw new DeepgramError(
          "Mimetype must be provided if the source is a Buffer or a Readable"
        );
      }

      let body;
      if (this._isUrlSource(source)) {
        body = JSON.stringify(source);
      } else if (this._isBufferSource(source)) {
        body = source.buffer;
      } else if (this._isReadStreamSource(source)) {
        body = source.stream;
      } else {
        throw new DeepgramError("Unknown transcription source type");
      }

      if (!this._isUrlSource(source)) {
        this.headers["Content-Type"] = source.mimetype;
      }

      if (!this.fetch) {
        throw new DeepgramError("Invalid fetch configuration");
      }

      const transcriptionOptions: PreRecordedOptions = { ...{}, ...options };
      const url = new URL(endpoint, this.apiUrl);

      Object.keys(transcriptionOptions).forEach((i) => {
        if (Array.isArray(transcriptionOptions[i])) {
          const arrayParams = transcriptionOptions[i] as Array<any>;
          arrayParams.forEach((param) => {
            url.searchParams.append(i, String(param));
          });
        } else {
          url.searchParams.append(i, String(transcriptionOptions[i]));
        }
      });

      const result: PreRecordedResponse = await this.post(
        this.fetch,
        `${this.apiUrl}/${endpoint}`,
        body,
        { headers: this.headers }
      );

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  private _isUrlSource(providedSource: PreRecordedSource): providedSource is UrlSource {
    if ((providedSource as UrlSource).url) return true;

    return false;
  }

  private _isBufferSource(providedSource: PreRecordedSource): providedSource is BufferSource {
    if ((providedSource as BufferSource).buffer) return true;

    return false;
  }

  private _isReadStreamSource(
    providedSource: PreRecordedSource
  ): providedSource is ReadStreamSource {
    if ((providedSource as ReadStreamSource).stream) return true;

    return false;
  }
}
