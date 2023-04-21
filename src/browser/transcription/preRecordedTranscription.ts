import querystring from "querystring";
import {
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  UrlSource,
} from "../../types";
import { _request } from "../httpFetch";

function isUrlSource(providedSource: UrlSource): providedSource is UrlSource {
  if ((providedSource as UrlSource).url) return true;
  return false;
}

/**
 * Transcribes audio from a url
 * @param credentials Base64 encoded API key & secret
 * @param apiUrl url string of Deepgram's API
 * @param requireSSL Whether the request should use HTTPS or HTTP
 * @param source Url or Buffer of file to transcribe
 * @param options Options to modify transcriptions
 */
export const preRecordedTranscription = async (
  apiKey: string,
  apiUrl: string,
  requireSSL: boolean,
  source: UrlSource,
  options?: PrerecordedTranscriptionOptions
): Promise<PrerecordedTranscriptionResponse> => {
  const transcriptionOptions = { ...{}, ...options };
  if (!isUrlSource(source)) {
    throw new Error("DG: Source must be a URL string");
  }

  const body = JSON.stringify(source);

  const response = await _request<PrerecordedTranscriptionResponse>(
    "POST",
    apiKey,
    apiUrl,
    requireSSL,
    `/v1/listen?${querystring.stringify(transcriptionOptions)}`,
    body
  );

  return Object.assign(new PrerecordedTranscriptionResponse(), response);
};
