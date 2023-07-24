import { Headers as CrossFetchHeaders } from "cross-fetch";
import WebSocket from "isomorphic-ws";
import type { DeepgramClientOptions } from "./types/DeepgramClientOptions";
import type { TranscriptionOptions } from "./types/TranscriptionOptions";

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export const isBrowser = () => typeof window !== "undefined";

export function applySettingDefaults(
  options: DeepgramClientOptions,
  defaults: DeepgramClientOptions
): DeepgramClientOptions {
  const { global: globalOptions } = options;

  const { global: DEFAULT_GLOBAL_OPTIONS } = defaults;

  return {
    global: {
      ...DEFAULT_GLOBAL_OPTIONS,
      ...globalOptions,
    },
  };
}

export function appendSearchParams(
  searchParams: URLSearchParams,
  options: TranscriptionOptions
): void {
  Object.keys(options).forEach((i) => {
    if (Array.isArray(options[i])) {
      const arrayParams = options[i] as Array<any>;
      arrayParams.forEach((param) => {
        searchParams.append(i, String(param));
      });
    } else {
      searchParams.append(i, String(options[i]));
    }
  });
}

export const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return CrossFetchHeaders;
  }

  return Headers;
};

export const wsWithAuth = (
  deepgramKey: string,
  customWs?: WebSocket
): ((url: string, options: any) => WebSocket) => {
  return (url, options) => {
    if (customWs) {
      return customWs;
    }

    if (!("Authorization" in options?.headers)) {
      options.headers["Authorization"] = `Token ${deepgramKey}`;
    }

    return new WebSocket(url, options);
  };
};
