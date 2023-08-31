import { applySettingDefaults, stripTrailingSlash, wsWithAuth } from "./lib/helpers";
import { DEFAULT_URL, DEFAULT_OPTIONS } from "./lib/constants";
import { fetchWithAuth } from "./lib/fetch";
import { ListenClient } from "./packages/ListenClient";
import type { DeepgramClientOptions } from "./lib/types/DeepgramClientOptions";
import type { Fetch } from "./lib/types/Fetch";
// import { WebSocket } from "isomorphic-ws";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 * @see https://developers.deepgram.com
 */
export default class DeepgramClient {
  protected key: string;
  protected url: URL;
  protected fetch?: Fetch;
  protected headers: Record<string, string>;
  // protected ws?: (url: string, options: any) => WebSocket;

  constructor(
    protected apiKey: string,
    options: DeepgramClientOptions | undefined = DEFAULT_OPTIONS
  ) {
    this.key = apiKey;

    if (!apiKey) {
      this.key = process.env.DEEPGRAM_API_KEY as string;
    }

    if (!this.key) {
      if (!apiKey) throw new Error("A deepgram API key is required");
    }

    const settings = applySettingDefaults(options, DEFAULT_OPTIONS);

    if (!settings.global.url) {
      throw new Error(
        `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
      );
    }

    let url = settings.global.url;

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    this.url = new URL(stripTrailingSlash(url));
    this.headers = settings.global?.headers ?? {};
    this.fetch = fetchWithAuth(this.key, settings.global?.fetch);
    // this.ws = wsWithAuth(key, settings.global?.ws);
  }

  get listen(): ListenClient {
    return new ListenClient(this.url, this.headers, this.fetch /*, this.ws*/);
  }
}
