import querystring from "querystring";
import { request } from "https";
import {
  TranscriptionResponse,
  TranscriptionOptions,
  TranscriptionSource,
  UrlSource,
} from "../types";

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
  credentials: string,
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

  return await _listen(credentials, apiUrl, source, transcriptionOptions);
};

const _listen = async (
  credentials: string,
  apiUrl: string,
  source: TranscriptionSource,
  options: TranscriptionOptions
): Promise<TranscriptionResponse> => {
  const requestOptions = {
    host: apiUrl,
    path: `/v1/transcribe?${querystring.stringify(options)}`,
    method: "POST",
    headers: {
      "Content-Type": isUrlSource(source)
        ? "application/json"
        : source.mimetype,
      Authorization: `Basic ${credentials}`,
    },
  };

  return new Promise((resolve, reject) => {
    try {
      const httpRequest = request(requestOptions, (dgRes) => {
        let dgResContent = "";

        dgRes.on("data", (chunk) => {
          dgResContent += chunk;
        });

        dgRes.on("end", () => {
          const dgResJson = JSON.parse(dgResContent);
          if (dgResJson.error) {
            reject(`DG: ${dgResContent}`);
          }
          resolve(dgResJson);
        });

        dgRes.on("error", (err) => {
          reject(`DG: ${err}`);
        });
      });

      httpRequest.on("error", (err) => {
        reject(`DG: ${err}`);
      });

      const payload = isUrlSource(source)
        ? JSON.stringify({ url: source.url })
        : source.buffer;

      httpRequest.write(payload);
      httpRequest.end();
    } catch (err) {
      reject(err);
    }
  });
};
