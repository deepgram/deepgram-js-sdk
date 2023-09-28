import { PrerecordedClient } from "./PrerecordedClient";
import { LiveClient } from "./LiveClient";
import { LiveOptions } from "../lib/types";

export class ListenClient {
  protected baseUrl: URL;
  protected headers: Record<string, string>;
  protected key: string;

  constructor(baseUrl: URL, headers: Record<string, string>, apiKey: string) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.key = apiKey;
  }

  get prerecorded() {
    return new PrerecordedClient(this.baseUrl, this.headers, this.key);
  }

  public live(options: LiveOptions, endpoint = "v1/listen") {
    return new LiveClient(this.baseUrl, this.key, options, endpoint);
  }
}
