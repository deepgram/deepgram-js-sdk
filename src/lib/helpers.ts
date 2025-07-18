import {
  DeepgramClientOptions,
  FileSource,
  PrerecordedSource,
  UrlSource,
  TextSource,
  AnalyzeSource,
  LiveSchema,
  TranscriptionSchema,
} from "./types";
import { Headers as CrossFetchHeaders } from "cross-fetch";
import type { Readable } from "node:stream";
import merge from "deepmerge";
import { isBrowser } from "./runtime";

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function applyDefaults<O, S>(options: Partial<O> = {}, subordinate: Partial<S> = {}): S {
  return merge(subordinate, options);
}

export function appendSearchParams(
  searchParams: URLSearchParams,
  options: Record<string, unknown>
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

export const isUrlSource = (
  providedSource: PrerecordedSource | AnalyzeSource
): providedSource is UrlSource => {
  if (providedSource && (providedSource as UrlSource).url) return true;

  return false;
};

export const isTextSource = (
  providedSource: PrerecordedSource | AnalyzeSource
): providedSource is TextSource => {
  if (providedSource && (providedSource as TextSource).text) return true;

  return false;
};

export const isFileSource = (providedSource: PrerecordedSource): providedSource is FileSource => {
  if (isReadStreamSource(providedSource) || isBufferSource(providedSource)) return true;

  return false;
};

const isBufferSource = (providedSource: PrerecordedSource): providedSource is Buffer => {
  return providedSource != null && Buffer.isBuffer(providedSource);
};

const isReadStreamSource = (providedSource: PrerecordedSource): providedSource is Readable => {
  if (providedSource == null) return false;

  // In browser environments, there's no Readable stream from Node.js
  if (isBrowser()) return false;

  // Check for stream-like properties without importing Readable
  return (
    typeof providedSource === "object" &&
    typeof (providedSource as any).pipe === "function" &&
    typeof (providedSource as any).read === "function" &&
    typeof (providedSource as any)._readableState === "object"
  );
};

export class CallbackUrl extends URL {
  public callbackUrl = true;
}

export const convertProtocolToWs = (url: string) => {
  const convert = (string: string) => string.toLowerCase().replace(/^http/, "ws");

  return convert(url);
};

export const buildRequestUrl = (
  endpoint: string,
  baseUrl: string | URL,
  transcriptionOptions: LiveSchema | TranscriptionSchema
): URL => {
  const url = new URL(endpoint, baseUrl);
  appendSearchParams(url.searchParams, transcriptionOptions);

  return url;
};

export function isLiveSchema(arg: any): arg is LiveSchema {
  return arg != null && typeof arg.interim_results !== "undefined";
}

export function isDeepgramClientOptions(arg: any): arg is DeepgramClientOptions {
  return arg != null && typeof arg.global !== "undefined";
}

export const convertLegacyOptions = (optionsArg: DeepgramClientOptions): DeepgramClientOptions => {
  const newOptions: DeepgramClientOptions = {};

  if (optionsArg._experimentalCustomFetch) {
    newOptions.global = {
      fetch: {
        client: optionsArg._experimentalCustomFetch,
      },
    };
  }

  optionsArg = merge(optionsArg, newOptions);

  if (optionsArg.restProxy?.url) {
    newOptions.global = {
      fetch: {
        options: {
          proxy: {
            url: optionsArg.restProxy?.url,
          },
        },
      },
    };
  }

  optionsArg = merge(optionsArg, newOptions);

  if (optionsArg.global?.url) {
    newOptions.global = {
      fetch: {
        options: {
          url: optionsArg.global.url,
        },
      },
      websocket: {
        options: {
          url: optionsArg.global.url,
        },
      },
    };
  }

  optionsArg = merge(optionsArg, newOptions);

  if (optionsArg.global?.headers) {
    newOptions.global = {
      fetch: {
        options: {
          headers: optionsArg.global?.headers,
        },
      },
      websocket: {
        options: {
          _nodeOnlyHeaders: optionsArg.global?.headers,
        },
      },
    };
  }

  optionsArg = merge(optionsArg, newOptions);

  return optionsArg;
};
