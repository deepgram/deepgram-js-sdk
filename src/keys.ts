import { request } from "https";
import { RequestOptions } from "node:https";
import { ApiKeyResponse, Key } from "./types";

export const Keys = {
  async list(credentials: string, apiUrl: string): Promise<ApiKeyResponse> {
    return _request<ApiKeyResponse>("GET", credentials, apiUrl);
  },

  async create(
    credentials: string,
    apiUrl: string,
    label: string
  ): Promise<Key> {
    return _request<Key>("POST", credentials, apiUrl, { label });
  },

  async delete(
    credentials: string,
    apiUrl: string,
    key: string
  ): Promise<void> {
    return _request<void>("DELETE", credentials, apiUrl, { key });
  },
};

const _requestOptions = (
  credentials: string,
  apiUrl: string,
  method: string
): RequestOptions => {
  return {
    host: apiUrl,
    path: "/v2/keys",
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
  };
};

function _request<T>(
  method: string,
  credentials: string,
  apiUrl: string,
  payload?: unknown
): Promise<T> {
  const requestOptions = _requestOptions(credentials, apiUrl, method);
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
        httpRequest.write(payload);
      }

      httpRequest.end();
    } catch (err) {
      reject(err);
    }
  });
}
