import { resolveFetch } from "../lib/fetch";
import type { Fetch } from "../lib/types/Fetch";

export class AbstractRestfulClient {
  protected apiUrl: string;
  protected headers: Record<string, string>;
  protected fetch?: Fetch;

  constructor(apiUrl: string, headers: Record<string, string>, fetch?: Fetch) {
    this.apiUrl = apiUrl;
    this.headers = headers;
    this.fetch = resolveFetch(fetch);
  }

  protected async _handleRequest(
    fetcher: Fetch,
    method: RequestMethodType,
    url: string,
    options?: FetchOptions,
    parameters?: FetchParameters,
    body?: object
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body))
        .then((result) => {
          if (!result.ok) throw result;
          if (options?.noResolveJson) return result;
          return result.json();
        })
        .then((data) => resolve(data))
        .catch((error) => handleError(error, reject));
    });
  }
}
