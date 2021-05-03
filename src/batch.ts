import querystring from "querystring";
import { request } from "https";
import { ApiBatchResponse, TranscriptionOptions } from "./types";

/**
 * Transcribes audio from a file or buffer
 * @param credentials Base64 encoded API key & secret
 * @param source Url or Buffer of file to transcribe
 * @param options Options to modify transcriptions
 */
export const transcribe = async (
  credentials: string,
  apiUrl: string,
  source: string | Buffer,
  options?: TranscriptionOptions
): Promise<ApiBatchResponse> => {
  const transcriptionOptions = { ...{}, ...options };

  if (
    typeof source !== "string" &&
    transcriptionOptions.mimetype === undefined
  ) {
    throw new Error("DG: Mimetype must be provided if the source is a Buffer");
  }

  return await _listen(credentials, apiUrl, source, transcriptionOptions);
};

const _listen = async (
  credentials: string,
  apiUrl: string,
  source: string | Buffer,
  options: TranscriptionOptions
): Promise<ApiBatchResponse> => {
  const requestOptions = {
    host: apiUrl,
    path: `/v2/listen?${querystring.stringify(options)}`,
    method: "POST",
    headers: {
      "Content-Type":
        typeof source === "string" ? "application/json" : options.mimetype,
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

      const payload =
        typeof source === "string" ? JSON.stringify({ url: source }) : source;

      httpRequest.write(payload);
      httpRequest.end();
    } catch (err) {
      reject(err);
    }
  });
};
