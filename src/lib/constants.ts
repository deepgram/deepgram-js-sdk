import { isBrowser } from "./helpers";
import { FetchOptions } from "./types/Fetch";
import { version } from "./version";

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version}`,
};

export const DEFAULT_URL = "https://api.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS = {
  url: DEFAULT_URL,
};

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  headers: DEFAULT_HEADERS,
};

export const DEFAULT_OPTIONS = {
  global: DEFAULT_GLOBAL_OPTIONS,
  fetch: DEFAULT_FETCH_OPTIONS,
};
