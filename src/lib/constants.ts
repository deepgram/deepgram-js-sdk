import { convertProtocolToWs, isBrowser } from "./helpers";
import { version } from "./version";
import type { DefaultNamespaceOptions, DefaultClientOptions } from "./types";

export const NODE_VERSION = process.versions.node;

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version} ${isBrowser() ? "javascript" : `node/${NODE_VERSION}`}`,
};

export const DEFAULT_URL = "https://api.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS: Partial<DefaultNamespaceOptions> = {
  fetch: { options: { url: DEFAULT_URL, headers: DEFAULT_HEADERS } },
  websocket: {
    options: { url: convertProtocolToWs(DEFAULT_URL), _nodeOnlyHeaders: DEFAULT_HEADERS },
  },
};

export const DEFAULT_OPTIONS: DefaultClientOptions = {
  global: DEFAULT_GLOBAL_OPTIONS,
};

export enum SOCKET_STATES {
  connecting = 0,
  open = 1,
  closing = 2,
  closed = 3,
}

export enum CONNECTION_STATE {
  Connecting = "connecting",
  Open = "open",
  Closing = "closing",
  Closed = "closed",
}
