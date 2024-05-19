import { DeepgramApiError, DeepgramError, DeepgramUnknownError } from "../lib/errors";
import { Readable } from "stream";
import { fetchWithAuth, resolveResponse } from "../lib/fetch";
import type { Fetch, FetchOptions, RequestMethodType } from "../lib/types/Fetch";
import { AbstractClient } from "./AbstractClient";
import { DeepgramClientOptions } from "../lib/types";
import { isBrowser } from "../lib/helpers";
import merge from "deepmerge";

export abstract class AbstractRestClient extends AbstractClient {
  protected fetch: Fetch;

  // Constructor implementation
  constructor(options: DeepgramClientOptions) {
    super(options);

    if (isBrowser() && !this.proxy) {
      throw new DeepgramError(
        "Due to CORS we are unable to support REST-based API calls to our API from the browser. Please consider using a proxy: https://dpgr.am/js-proxy for more information."
      );
    }

    this.fetch = fetchWithAuth(this.key, this.namespaceOptions.fetch.client);

    if (this.proxy) {
      this.baseUrl = this.namespaceOptions.fetch.options.proxy!.url;
    } else {
      this.baseUrl = this.namespaceOptions.fetch.options.url;
    }
  }

  protected _getErrorMessage(err: any): string {
    return err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
  }

  protected async _handleError(error: unknown, reject: (reason?: any) => void) {
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

  protected _getRequestOptions(
    method: RequestMethodType,
    bodyOrOptions?: string | Buffer | Readable | FetchOptions,
    options?: FetchOptions
  ): FetchOptions {
    let reqOptions: FetchOptions = { method };

    if (method === "GET" || method === "DELETE") {
      reqOptions = { ...reqOptions, ...(bodyOrOptions as FetchOptions) };
    } else {
      reqOptions = {
        duplex: "half",
        body: bodyOrOptions as BodyInit,
        ...reqOptions,
        ...options,
      };
    }

    return merge(this.namespaceOptions.fetch.options, reqOptions);
  }

  protected async _handleRequest(
    method: "GET" | "DELETE",
    url: URL,
    options?: FetchOptions
  ): Promise<Response>;
  protected async _handleRequest(
    method: "POST" | "PUT" | "PATCH",
    url: URL,
    body: string | Buffer | Readable,
    options?: FetchOptions
  ): Promise<Response>;
  protected async _handleRequest(
    method: RequestMethodType,
    url: URL,
    bodyOrOptions?: string | Buffer | Readable | FetchOptions,
    options?: FetchOptions
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const fetcher = this.fetch;

      fetcher(url, this._getRequestOptions(method, bodyOrOptions, options))
        .then((result) => {
          if (!result.ok) throw result;
          resolve(result);
        })
        .catch((error) => this._handleError(error, reject));
    });
  }

  protected async get(url: URL, options?: FetchOptions): Promise<any> {
    return this._handleRequest("GET", url, options);
  }

  protected async post(
    url: URL,
    body: string | Buffer | Readable,
    options?: FetchOptions
  ): Promise<any> {
    return this._handleRequest("POST", url, body, options);
  }

  protected async put(
    url: URL,
    body: string | Buffer | Readable,
    options?: FetchOptions
  ): Promise<any> {
    return this._handleRequest("PUT", url, body, options);
  }

  protected async patch(
    url: URL,
    body: string | Buffer | Readable,
    options?: FetchOptions
  ): Promise<any> {
    return this._handleRequest("PATCH", url, body, options);
  }

  protected async delete(url: URL, options?: FetchOptions): Promise<any> {
    return this._handleRequest("DELETE", url, options);
  }
}
