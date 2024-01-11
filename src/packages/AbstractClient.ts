import { DEFAULT_OPTIONS, DEFAULT_URL } from "../lib/constants";
import { DeepgramError } from "../lib/errors";
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

  constructor(protected key: string, protected options: DeepgramClientOptions) {
    this.key = key;

    if (!key) {
      this.key = process.env.DEEPGRAM_API_KEY as string;
    }

    if (!this.key) {
      throw new DeepgramError("A deepgram API key is required");
    }

    this.options = applySettingDefaults(options, DEFAULT_OPTIONS);

    if (!this.options.global?.url) {
      throw new DeepgramError(
        `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
      );
    }

    let baseUrlString: string = this.options.global.url;
    let proxyUrlString: string;

    /**
     * Check if the base URL provided is missing a protocol and warn in the console.
     */
    if (!baseUrlString.startsWith("http") && !baseUrlString.startsWith("ws")) {
      console.warn(
        `The base URL provided does not begin with http, https, ws, or wss and will default to https as standard.`
      );
    }

    /**
     * Applying proxy to base URL.
     */
    if (this.options.restProxy?.url) {
      /**
       * Prevent client using a real API key when using a proxy configuration.
       */
      if (this.key !== "proxy") {
        throw new DeepgramError(
          `Do not attempt to pass any other API key than the string "proxy" when making proxied REST requests. Please ensure your proxy application is responsible for writing our API key to the Authorization header.`
        );
      }

      proxyUrlString = this.options.restProxy.url;

      /**
       * Check if the proxy URL provided is missing a protocol and warn in the console.
       */
      if (!proxyUrlString.startsWith("http") && !proxyUrlString.startsWith("ws")) {
        console.warn(
          `The proxy URL provided does not begin with http, https, ws, or wss and will default to https as standard.`
        );
      }

      baseUrlString = proxyUrlString;
    }

    this.baseUrl = this.resolveBaseUrl(baseUrlString);
  }

  protected resolveBaseUrl(url: string) {
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    return new URL(stripTrailingSlash(url));
  }

  protected willProxy() {
    const proxyUrl = this.options.restProxy?.url;

    return !!proxyUrl;
  }
}
