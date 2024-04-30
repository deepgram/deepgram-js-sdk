import { isBrowser } from "./helpers";
import { DeepgramClientOptions } from "./types/DeepgramClientOptions";
import { FetchOptions } from "./types/Fetch";
import { version } from "./version";

export const NODE_VERSION =
  typeof process !== "undefined" && process.versions && process.versions.node
    ? process.versions.node
    : "unknown";

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version} ${isBrowser() ? "javascript" : `node/${NODE_VERSION}`}`,
};

export const DEFAULT_URL = "https://api.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS = {
  url: DEFAULT_URL,
};

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  headers: DEFAULT_HEADERS,
};

export const DEFAULT_OPTIONS: DeepgramClientOptions = {
  global: DEFAULT_GLOBAL_OPTIONS,
  fetch: DEFAULT_FETCH_OPTIONS,
};
