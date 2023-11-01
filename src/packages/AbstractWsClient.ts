import { EventEmitter } from "events";
import { DEFAULT_OPTIONS, DEFAULT_URL } from "../lib/constants";
import { applySettingDefaults, stripTrailingSlash } from "../lib/helpers";
import { DeepgramClientOptions } from "../lib/types";

export abstract class AbstractWsClient extends EventEmitter {
  protected baseUrl: URL;

  constructor(
    protected key: string,
    protected options: DeepgramClientOptions | undefined = DEFAULT_OPTIONS
  ) {
    super();

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
    this.baseUrl.protocol = this.baseUrl.protocol.toLowerCase().replace(/(http)(s)?/gi, "ws$2");
  }
}
