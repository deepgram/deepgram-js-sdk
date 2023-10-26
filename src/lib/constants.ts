import { isBrowser } from "./helpers";
import { FetchOptions } from "./types/Fetch";
import { version } from "./version";

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version}`,
};

export const DEFAULT_URL = "api.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS = {
  url: DEFAULT_URL,
};

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  method: "GET", // GET, POST, PUT, PATCH, DELETE
  mode: "cors", // no-cors, cors, same-origin
  headers: DEFAULT_HEADERS,
  cache: "default", // default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, same-origin, omit
  redirect: "follow", // manual, follow, error
  referrerPolicy: "no-referrer-when-downgrade", // no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

export const DEFAULT_OPTIONS = {
  global: DEFAULT_GLOBAL_OPTIONS,
  fetch: DEFAULT_FETCH_OPTIONS,
};
