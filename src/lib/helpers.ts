import { Headers as CrossFetchHeaders } from "cross-fetch";
import {
  BufferSource,
  DeepgramClientOptions,
  PrerecordedSource,
  ReadStreamSource,
  UrlSource,
} from "./types";

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

export const isUrlSource = (providedSource: PrerecordedSource): providedSource is UrlSource => {
  if ((providedSource as UrlSource).url) return true;

  return false;
};

export const isBufferSource = (
  providedSource: PrerecordedSource
): providedSource is BufferSource => {
  if ((providedSource as BufferSource).buffer) return true;

  return false;
};

export const isReadStreamSource = (
  providedSource: PrerecordedSource
): providedSource is ReadStreamSource => {
  if ((providedSource as ReadStreamSource).stream) return true;

  return false;
};
