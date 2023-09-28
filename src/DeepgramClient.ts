import { applySettingDefaults, stripTrailingSlash } from "./lib/helpers";
import { DEFAULT_URL, DEFAULT_OPTIONS } from "./lib/constants";
import { ListenClient } from "./packages/ListenClient";
import { ManageClient } from "./packages/ManageClient";
import { OnPremClient } from "./packages/OnPremClient";
import type { DeepgramClientOptions } from "./lib/types/DeepgramClientOptions";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 * @see https://developers.deepgram.com
 */
export default class DeepgramClient {
  protected key: string;
  protected baseUrl: URL;
  protected headers: Record<string, string>;

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

    this.baseUrl = new URL(stripTrailingSlash(url));
    this.headers = settings.global?.headers ?? {};
  }

  get listen(): ListenClient {
    return new ListenClient(this.baseUrl, this.headers, this.key);
  }

  get manage(): ManageClient {
    return new ManageClient(this.baseUrl, this.headers, this.key);
  }

  get onprem(): OnPremClient {
    return new OnPremClient(this.baseUrl, this.headers, this.key);
  }
}
