import type { Fetch } from "./Fetch";
import WebSocket from "isomorphic-ws";

export interface DeepgramClientOptions {
  global: {
    /**
     * A custom `fetch` implementation.
     */
    fetch?: Fetch;

    /**
     * A custom `ws` class.
     */
    ws?: WebSocket;

    /**
     * Optional headers for initializing the client.
     */
    headers?: Record<string, string>;

    /**
     * The URL used to interact with production, On-prem and other Deepgram environments. Defaults to `https://api.deepgram.com`.
     */
    url?: string;
  };
}
