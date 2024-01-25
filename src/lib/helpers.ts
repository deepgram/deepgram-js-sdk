import { Headers as CrossFetchHeaders } from "cross-fetch";
import {
  DeepgramClientOptions,
  FileSource,
  PrerecordedSource,
  UrlSource,
  TextSource,
  AnalyzeSource,
} from "./types";
import { Readable } from "stream";
import merge from "deepmerge";

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export const isBrowser = () => typeof window !== "undefined";
export const isServer = () => typeof process !== "undefined";

export function applySettingDefaults(
  options: DeepgramClientOptions,
  defaults: DeepgramClientOptions
): DeepgramClientOptions {
  return merge(defaults, options);
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
  if ((providedSource as UrlSource).url) return true;

  return false;
};

export const isTextSource = (
  providedSource: PrerecordedSource | AnalyzeSource
): providedSource is TextSource => {
  if ((providedSource as TextSource).text) return true;

  return false;
};

export const isFileSource = (providedSource: PrerecordedSource): providedSource is FileSource => {
  if (isReadStreamSource(providedSource) || isBufferSource(providedSource)) return true;

  return false;
};

const isBufferSource = (providedSource: PrerecordedSource): providedSource is Buffer => {
  if (providedSource as Buffer) return true;

  return false;
};

const isReadStreamSource = (providedSource: PrerecordedSource): providedSource is Readable => {
  if (providedSource as Readable) return true;

  return false;
};

export class CallbackUrl extends URL {
  private callbackUrl = true;
}
