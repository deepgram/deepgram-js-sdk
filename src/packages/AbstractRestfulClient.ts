import { DeepgramApiError, DeepgramUnknownError } from "../lib/errors";
import { Readable } from "stream";
import { fetchWithAuth, resolveResponse } from "../lib/fetch";
import type { Fetch, FetchOptions, FetchParameters, RequestMethodType } from "../lib/types/Fetch";
import { AbstractClient } from "./AbstractClient";
import { DeepgramClientOptions } from "../lib/types";
import { DEFAULT_OPTIONS } from "../lib/constants";

export abstract class AbstractRestfulClient extends AbstractClient {
  protected fetch: Fetch;

  constructor(protected key: string, protected options: DeepgramClientOptions) {
    super(key, options);
    this.fetch = fetchWithAuth(this.key);
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
    headers?: Record<string, string>,
    parameters?: FetchParameters,
    body?: string | Buffer | Readable
  ) {
    const params: { [k: string]: any } = {
      ...this.options?.fetch,
      method,
      headers: { ...this.options?.fetch?.headers, ...headers } || {},
    };

    if (method === "GET") {
      return params;
    }

    params.body = body;
    params.duplex = "half";

    return { ...params, ...parameters };
  }

  protected async _handleRequest(
    fetcher: Fetch,
    method: RequestMethodType,
    url: string | URL,
    headers?: Record<string, string>,
    parameters?: FetchParameters,
    body?: string | Buffer | Readable
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fetcher(url, this._getRequestParams(method, headers, parameters, body))
        .then((result) => {
          if (!result.ok) throw result;
          return result.json();
        })
        .then((data) => resolve(data))
        .catch((error) => this.handleError(error, reject));
    });
  }

  protected async get(
    fetcher: Fetch,
    url: string | URL,
    headers?: Record<string, string>,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "GET", url, headers, parameters);
  }

  protected async post(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    headers?: Record<string, string>,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "POST", url, headers, parameters, body);
  }

  protected async put(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    headers?: Record<string, string>,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "PUT", url, headers, parameters, body);
  }

  protected async patch(
    fetcher: Fetch,
    url: string | URL,
    body: string | Buffer | Readable,
    headers?: Record<string, string>,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "PATCH", url, headers, parameters, body);
  }

  protected async delete(
    fetcher: Fetch,
    url: string | URL,
    headers?: Record<string, string>,
    parameters?: FetchParameters
  ): Promise<any> {
    return this._handleRequest(fetcher, "DELETE", url, headers, parameters);
  }
}
