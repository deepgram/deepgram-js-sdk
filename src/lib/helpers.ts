import type { DeepgramClientOptions } from "./types/DeepgramClientOptions";
import { TranscriptionOptions } from "./types/TranscriptionOptions";

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
