import { convertProtocolToWs, isBrowser } from "./helpers";
import { DefaultNamespaceOptions, DefaultClientOptions } from "./types/DeepgramClientOptions";
import { version } from "./version";

export const NODE_VERSION =
  typeof process === "undefined"
    ? "Unknown"
    : process?.versions?.node || "Unknown";

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version} ${isBrowser() ? "javascript" : `node/${NODE_VERSION}`}`,
};

export const DEFAULT_URL = "https://api.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS: DefaultNamespaceOptions = {
  fetch: { options: { url: DEFAULT_URL, headers: DEFAULT_HEADERS } },
  websocket: { options: { url: convertProtocolToWs(DEFAULT_URL) } },
};

export const DEFAULT_OPTIONS: DefaultClientOptions = {
  global: DEFAULT_GLOBAL_OPTIONS,
};
