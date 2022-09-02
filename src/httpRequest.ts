import { Readable } from "stream";
import { request, RequestOptions } from "https";
import { userAgent } from "./userAgent";

const _requestOptions = (
  api_key: string,
  apiUrl: string,
  path: string,
  method: string,
  payload?: string | Buffer | Readable,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override_options?: any
): RequestOptions => {
  const additionalHeaders: { [name: string]: string | number } = {};
  if (payload && !(payload instanceof Readable)) {
    additionalHeaders["Content-Length"] = Buffer.byteLength(payload);
  }

  const options = {
    host: apiUrl,
    path,
    method,
    headers: {
      "User-Agent": userAgent(),
      "Content-Type": "application/json",
      Authorization: `token ${api_key}`,
      ...additionalHeaders,
    },
  };
  let headers = options.headers;
  if (override_options && override_options.headers) {
    headers = { ...headers, ...override_options.headers };
  }

  return { ...options, ...override_options, ...{ headers } };
};

export function _request<T>(
  method: string,
  api_key: string,
  apiUrl: string,
  path: string,
  payload?: string | Buffer | Readable,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options?: Object
): Promise<T> {
  const requestOptions = _requestOptions(
    api_key,
    apiUrl,
    path,
    method,
    payload,
    options
  );
  return new Promise((resolve, reject) => {
    try {
      const httpRequest = request(requestOptions, (dgRes) => {
        let dgResContent = "";

        dgRes.on("data", (chunk) => {
          dgResContent += chunk;
        });

        dgRes.on("end", () => {
          let dgResponse;
          try {
            dgResponse = JSON.parse(dgResContent);
          } catch (err) {
            dgResponse = { error: dgResContent };
          }

          if (dgRes.statusCode && dgRes.statusCode >= 400) {
            reject(`DG: ${dgResponse.err_code}: ${dgResponse.err_msg}`);
          }

          if (dgResponse.error) {
            reject(`DG: ${dgResContent}`);
          }
          resolve(dgResponse);
        });

        dgRes.on("error", (err) => {
          reject(`DG: ${err}`);
        });
      });

      httpRequest.on("error", (err) => {
        reject(`DG: ${err}`);
      });

      if (payload) {
        if (payload instanceof Readable) {
          payload.pipe(httpRequest);
          payload.on("finish", function () {
            httpRequest.end();
          });
        } else {
          // It's a buffer
          httpRequest.write(payload);
          httpRequest.end();
        }
      } else {
        httpRequest.end();
      }
    } catch (err) {
      reject(`DG: ${err}`);
    }
  });
}
