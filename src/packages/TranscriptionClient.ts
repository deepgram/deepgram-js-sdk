import { PreRecordedClient } from "./PreRecordedClient";
import { resolveFetch } from "../lib/fetch";
import type { Fetch } from "../lib/types/Fetch";

export class TranscriptionClient {
  protected apiUrl: string;
  protected wsUrl: string;
  protected headers: Record<string, string>;
  protected fetch?: Fetch;

  constructor(apiUrl: string, wsUrl: string, headers: Record<string, string>, fetch?: Fetch) {
    this.apiUrl = apiUrl;
    this.wsUrl = wsUrl;
    this.headers = headers;
    this.fetch = resolveFetch(fetch);
  }

  get prerecorded() {
    return new PreRecordedClient(this.apiUrl, this.headers, this.fetch);
  }

  // get live() {
  //   return new LiveClient(this.wsUrl, this.headers, this.ws);
  // }
}
