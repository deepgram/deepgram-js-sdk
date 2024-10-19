import { convertProtocolToWs, isBrowser, isBun, isNode } from "./helpers";
import { version } from "./version";
import type { DefaultNamespaceOptions, DefaultClientOptions } from "./types";

export const NODE_VERSION =
  typeof process !== "undefined" && process.versions && process.versions.node
    ? process.versions.node
    : "unknown";

export const BUN_VERSION =
  typeof process !== "undefined" && process.versions && process.versions.bun
    ? process.versions.bun
    : "unknown";

export const BROWSER_AGENT =
  typeof window !== "undefined" && window.navigator && window.navigator.userAgent
    ? window.navigator.userAgent
    : "unknown";

const getAgent = () => {
  if (isNode()) {
    return `node/${NODE_VERSION}`;
  } else if (isBun()) {
    return `bun/${BUN_VERSION}`;
  } else if (isBrowser()) {
    return `javascript ${BROWSER_AGENT}`;
  } else {
    return `unknown`;
  }
};

export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`,
  "User-Agent": `@deepgram/sdk/${version} ${getAgent()}`,
};

export const DEFAULT_URL = "https://api.deepgram.com";
export const DEFAULT_AGENT_URL = "wss://agent.deepgram.com";

export const DEFAULT_GLOBAL_OPTIONS: Partial<DefaultNamespaceOptions> = {
  fetch: { options: { url: DEFAULT_URL, headers: DEFAULT_HEADERS } },
  websocket: {
    options: { url: convertProtocolToWs(DEFAULT_URL), _nodeOnlyHeaders: DEFAULT_HEADERS },
  },
};

export const DEFAULT_AGENT_OPTIONS: Partial<DefaultNamespaceOptions> = {
  fetch: { options: { url: DEFAULT_URL, headers: DEFAULT_HEADERS } },
  websocket: {
    options: { url: DEFAULT_AGENT_URL, _nodeOnlyHeaders: DEFAULT_HEADERS },
  },
};

export const DEFAULT_OPTIONS: DefaultClientOptions = {
  global: DEFAULT_GLOBAL_OPTIONS,
  agent: DEFAULT_AGENT_OPTIONS,
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
