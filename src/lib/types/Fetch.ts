export type Fetch = typeof fetch;

export interface FetchOptions {
  headers?: {
    [key: string]: string;
  };
  noResolveJson?: boolean;
}

export type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE";

export interface FetchParameters {
  /**
   * Pass in an AbortController's signal to cancel the request.
   */
  signal?: AbortSignal;
}
