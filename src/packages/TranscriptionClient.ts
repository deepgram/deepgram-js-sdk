import { LiveClient } from "./LiveClient";
import { PreRecordedClient } from "./PreRecordedClient";
import WebSocket from "isomorphic-ws";
import type { Fetch } from "../lib/types/Fetch";

export class TranscriptionClient {
  protected apiUrl: string;
  protected wsUrl: string;
  protected headers: Record<string, string>;
  protected fetch?: Fetch;
  protected ws?: (url: string, options: any) => WebSocket;

  constructor(
    apiUrl: string,
    wsUrl: string,
    headers: Record<string, string>,
    fetch?: Fetch,
    ws?: (url: string, options: any) => WebSocket
  ) {
    this.apiUrl = apiUrl;
    this.wsUrl = wsUrl;
    this.headers = headers;
    this.fetch = fetch;
    this.ws = ws;
  }

  get prerecorded() {
    return new PreRecordedClient(this.apiUrl, this.headers, this.fetch);
  }

  get live() {
    return new LiveClient(this.wsUrl, this.headers, this.ws);
  }
}
