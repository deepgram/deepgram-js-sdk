import { DeepgramClientOptions } from "../lib/types";
import { AbstractClient } from "./AbstractClient";

export abstract class AbstractLiveClient extends AbstractClient {
  // Constructor implementation
  constructor(options: DeepgramClientOptions) {
    super(options);

    if (this.proxy) {
      this.baseUrl = this.namespaceOptions.websocket.options.proxy!.url;
    } else {
      this.baseUrl = this.namespaceOptions.websocket.options.url;
    }
  }
}
