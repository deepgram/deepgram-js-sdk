import { DeepgramClientOptions } from "@type/DeepgramClientOptions";

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

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
