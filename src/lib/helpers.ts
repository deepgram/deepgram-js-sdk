import { DeepgramClientOptions } from "@type/DeepgramClientOptions";

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
