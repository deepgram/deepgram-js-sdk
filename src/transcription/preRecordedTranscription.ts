import querystring from "querystring";
import {
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  TranscriptionSource,
  UrlSource,
  BufferSource,
  ReadStreamSource,
} from "../types";
import { _request } from "../httpRequest";

/**
 * @param providedSource TranscriptionSource
 * @returns boolean
 */
function isUrlSource(
  providedSource: TranscriptionSource
): providedSource is UrlSource {
  if ((providedSource as UrlSource).url) return true;
  return false;
}

/**
 * @param providedSource TranscriptionSource
 * @returns boolean
 */
function isBufferSource(
  providedSource: TranscriptionSource
): providedSource is BufferSource {
  if ((providedSource as BufferSource).buffer) return true;
  return false;
}

/**
 * @param providedSource TranscriptionSource
 * @returns boolean
 */
function isReadStreamSource(
  providedSource: TranscriptionSource
): providedSource is ReadStreamSource {
  if ((providedSource as ReadStreamSource).stream) return true;
  return false;
}

/**
 * Transcribes audio from a file or buffer
 *
 * @param apiKey string
 * @param apiUrl string
 * @param requireSSL boolean
 * @param source TranscriptionSource
 * @param options PrerecordedTranscriptionOptions
 * @param options string
 * @returns Promise<PrerecordedTranscriptionResponse>
 */
export const preRecordedTranscription = async (
  apiKey: string,
  apiUrl: string,
  requireSSL: boolean,
  source: TranscriptionSource,
  options?: PrerecordedTranscriptionOptions,
  endpoint = "v1/listen"
): Promise<PrerecordedTranscriptionResponse> => {
  const transcriptionOptions = { ...{}, ...options };

  if (
    !isUrlSource(source) &&
    (source.mimetype === undefined || source.mimetype.length === 0)
  ) {
    throw new Error(
      "DG: Mimetype must be provided if the source is a Buffer or a Readable"
    );
  }

  let body;
  if (isUrlSource(source)) {
    body = JSON.stringify(source);
  } else if (isBufferSource(source)) {
    body = source.buffer;
  } else if (isReadStreamSource(source)) {
    body = source.stream;
  } else {
    throw new Error("Unknown TranscriptionSource type");
  }

  const requestOptions: { [name: string]: { [key: string]: string } } = {};
  if (!isUrlSource(source)) {
    requestOptions.headers = {
      "Content-Type": source.mimetype,
    };
  }

  const response = await _request<PrerecordedTranscriptionResponse>(
    "POST",
    apiKey,
    apiUrl,
    requireSSL,
    `/${endpoint}?${querystring.stringify(transcriptionOptions)}`,
    body,
    requestOptions
  );

  return Object.assign(new PrerecordedTranscriptionResponse(), response);
};
