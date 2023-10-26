import { DEFAULT_OPTIONS, DEFAULT_URL } from "../lib/constants";
import { applySettingDefaults, stripTrailingSlash } from "../lib/helpers";
import { DeepgramClientOptions } from "../lib/types";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 * @see https://developers.deepgram.com
 */
export abstract class AbstractClient {
  protected baseUrl: URL;
  protected headers: Record<string, string>;

  constructor(protected key: string, protected options: DeepgramClientOptions) {
    this.key = key;

    if (!key) {
      this.key = process.env.DEEPGRAM_API_KEY as string;
    }

    if (!this.key) {
      throw new Error("A deepgram API key is required");
    }

    this.options = applySettingDefaults(options, DEFAULT_OPTIONS);

    if (!this.options.global?.url) {
      throw new Error(
        `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
      );
    }

    let url = this.options.global.url;

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    this.baseUrl = new URL(stripTrailingSlash(url));
    this.headers = this.options.global?.headers ?? {};
  }
}
