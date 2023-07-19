import { DEFAULT_URL, DEFAULT_OPTIONS } from "./lib/constants";
import { applySettingDefaults, stripTrailingSlash } from "./lib/helpers";
import type { DeepgramClientOptions } from "@type/DeepgramClientOptions";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 */
export default class DeepgramClient {
  protected apiUrl: string;
  protected wsUrl: string;

  /**
   * Create a new client for interacting with the Deepgram API.
   * @param deepgramKey The Deepgram API which is supplied when you create a new project in your console dashboard.
   * @param options.global.url You can override the default API URL to interact with On-prem and other Deepgram environments.
   */
  constructor(
    protected deepgramKey: string,
    options: DeepgramClientOptions | undefined = DEFAULT_OPTIONS
  ) {
    if (!deepgramKey) throw new Error("deepgramKey is required.");

    const settings = applySettingDefaults(options, DEFAULT_OPTIONS);

    if (!settings.global.url)
      throw new Error(
        `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
      );

    const _deepgramUrl = stripTrailingSlash(settings.global.url);

    this.apiUrl = _deepgramUrl;
    this.wsUrl = `${_deepgramUrl}`.replace(/^http/i, "ws");
  }
}
