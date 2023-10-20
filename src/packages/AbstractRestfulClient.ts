import { DeepgramApiError, DeepgramUnknownError } from "../lib/errors";
import { Readable } from "stream";
import { fetchWithAuth, resolveResponse } from "../lib/fetch";
import type { Fetch, FetchOptions, FetchParameters, RequestMethodType } from "../lib/types/Fetch";

export class AbstractRestfulClient {
  protected baseUrl: URL;
  protected headers: Record<string, string>;
  protected fetch: Fetch;

  constructor(baseUrl: URL, headers: Record<string, string>, apiKey: string) {
    this.baseUrl = baseUrl;
    this.headers = headers;

    this.fetch = fetchWithAuth(apiKey);
  }

  protected _getErrorMessage(err: any): string {
    return err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
  }

  protected async handleError(error: unknown, reject: (reason?: any) => void) {
    const Res = await resolveResponse();

    if (error instanceof Res) {
      error
        .json()
        .then((err) => {
          reject(new DeepgramApiError(this._getErrorMessage(err), error.status || 500));
        })
        .catch((err) => {
          reject(new DeepgramUnknownError(this._getErrorMessage(err), err));
        });
    } else {
      reject(new DeepgramUnknownError(this._getErrorMessage(error), error));
    }
  }

  protected _getRequestParams(
    method: RequestMethodType,
    options?: FetchOptions,
    parameters?: FetchParameters,
    body?: string | Buffer | Readable
  ) {
    const params: { [k: string]: any } = { method, headers: options?.headers || {} };

    if (method === "GET") {
      return params;
    }

    params.headers = { "Content-Type": "application/json", ...options?.headers };
    params.body = body;

    return { ...params, ...parameters, duplex: "half" };
  }

  protected async _handleRequest(
    fetcher: Fetch,
    method: RequestMethodType,
    url: string | URL,
    options?: FetchOptions,
    parameters?: FetchParameters,
    body?: string | Buffer | Readable
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fetcher(url, this._getRequestParams(method, options, parameters, body))
        .then((result) => {
          if (!result.ok) throw result;
          if (options?.noResolveJson) return result;
          return result.json();
        })
        .then((data) => resolve(data))
        .catch((error) => this.handleError(error, reject));
    });
  }

  protected async get(
    fetcher: Fetch,
    url: string | URL,
    options?: FetchOptions,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "GET", url, options, parameters);
  }

  protected async post(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    options?: FetchOptions,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "POST", url, options, parameters, body);
  }

  protected async put(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    options?: FetchOptions,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "PUT", url, options, parameters, body);
  }

  protected async patch(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    options?: FetchOptions,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "PATCH", url, options, parameters, body);
  }

  protected async delete(
    fetcher: Fetch,
    url: string | URL,
    options?: FetchOptions,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "DELETE", url, options, parameters);
  }
}
