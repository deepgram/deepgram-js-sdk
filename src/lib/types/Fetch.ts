export type Fetch = typeof fetch;

export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // GET, POST, PUT, DELETE, etc.
  mode: "cors" | "no-cors" | "same-origin"; // no-cors, cors, same-origin
  headers: Record<string, string>;
  cache: "default" | "no-cache" | "reload" | "force-cache" | "only-if-cached"; // default, no-cache, reload, force-cache, only-if-cached
  credentials: "include" | "same-origin" | "omit"; // include, same-origin, omit
  redirect: "manual" | "follow" | "error"; // manual, follow, error
  referrerPolicy: // no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
}

export type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchParameters {
  /**
   * Pass in an AbortController's signal to cancel the request.
   */
  signal?: AbortSignal;
}
