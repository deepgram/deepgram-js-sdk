import querystring from "querystring";
import {
  TranscriptionResponse,
  TranscriptionOptions,
  TranscriptionSource,
  UrlSource,
} from "../types";
import { _request } from "../httpRequest";

function isUrlSource(
  providedSource: TranscriptionSource
): providedSource is UrlSource {
  if ((providedSource as UrlSource).url) return true;
  return false;
}

/**
 * Transcribes audio from a file or buffer
 * @param credentials Base64 encoded API key & secret
 * @param source Url or Buffer of file to transcribe
 * @param options Options to modify transcriptions
 */
export const preRecordedTranscription = async (
  apiKey: string,
  apiUrl: string,
  source: TranscriptionSource,
  options?: TranscriptionOptions
): Promise<TranscriptionResponse> => {
  const transcriptionOptions = { ...{}, ...options };

  if (
    !isUrlSource(source) &&
    (source.mimetype === undefined || source.mimetype.length === 0)
  ) {
    throw new Error("DG: Mimetype must be provided if the source is a Buffer");
  }

  return await _request<TranscriptionResponse>(
    "POST",
    apiKey,
    apiUrl,
    `/v1/listen?${querystring.stringify(transcriptionOptions)}`,
    isUrlSource(source) ? JSON.stringify(source) : source.buffer,
    isUrlSource(source)
      ? undefined
      : {
          headers: {
            "Content-Type": source.mimetype,
          },
        }
  );
};
