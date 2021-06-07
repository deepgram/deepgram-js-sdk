import { request } from "https";
import { RequestOptions } from "node:https";

const _requestOptions = (
  credentials: string,
  apiUrl: string,
  path: string,
  method: string,
  payload?: unknown
): RequestOptions => {
  return {
    host: apiUrl,
    path,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Length": payload
        ? typeof payload === "string"
          ? Buffer.byteLength(payload)
          : Buffer.byteLength(JSON.stringify(payload))
        : undefined,
    },
  };
};

export function _request<T>(
  method: string,
  credentials: string,
  apiUrl: string,
  path: string,
  payload?: unknown
): Promise<T> {
  const requestOptions = _requestOptions(
    credentials,
    apiUrl,
    path,
    method,
    payload
  );
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

      if (payload) {
        httpRequest.write(
          typeof payload === "string" ? payload : JSON.stringify(payload)
        );
      }

      httpRequest.end();
    } catch (err) {
      reject(err);
    }
  });
}
