import { PrerecordedClient } from "./PrerecordedClient";
// import { LiveClient } from "./LiveClient";
import type { Fetch } from "../lib/types/Fetch";
// import type { LiveOptions } from "../lib/types/TranscriptionOptions";

export class ListenClient {
  protected url: URL;
  protected headers: Record<string, string>;
  protected fetch?: Fetch;
  // protected ws?: (url: string, options: any) => WebSocket;

  constructor(url: URL, headers: Record<string, string>, fetch?: Fetch) {
    this.url = url;
    this.headers = headers;
    this.fetch = fetch;
    // this.ws = ws;
  }

  get prerecorded() {
    return new PrerecordedClient(this.url, this.headers, this.fetch);
  }

  // public live(options: LiveOptions) {
  //   return new LiveClient(this.url, this.headers, this.fetch);
  // }
}