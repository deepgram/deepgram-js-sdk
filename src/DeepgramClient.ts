import { applySettingDefaults, stripTrailingSlash } from "./lib/helpers";
import { DEFAULT_URL, DEFAULT_OPTIONS } from "./lib/constants";
import { fetchWithAuth } from "./lib/fetch";
import type { DeepgramClientOptions } from "./lib/types/DeepgramClientOptions";
import type { Fetch } from "./lib/types/Fetch";
import { TranscriptionClient } from "./packages/TranscriptionClient";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 */
export default class DeepgramClient {
  protected apiUrl: string;
  protected wsUrl: string;
  protected fetch?: Fetch;
  protected headers: Record<string, string>;

  /**
   * Create a new client for interacting with the Deepgram API.
   * @param deepgramKey The Deepgram API which is supplied when you create a new project in your console dashboard.
   * @param options.global.url You can override the default API URL to interact with On-prem and other Deepgram environments.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
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
    this.fetch = fetchWithAuth(deepgramKey, settings.global?.fetch);
    this.headers = settings.global?.headers ?? ({} as Record<string, string>);
  }

  get transcription(): TranscriptionClient {
    return new TranscriptionClient(this.apiUrl, this.wsUrl, this.headers, this.fetch);
  }
}
