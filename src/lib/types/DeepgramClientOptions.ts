import { FetchOptions } from "./Fetch";

export interface DeepgramClientOptions {
  global?: {
    /**
     * Optional headers for initializing the client.
     */
    headers?: Record<string, string>;

    /**
     * The URL used to interact with production, On-prem and other Deepgram environments. Defaults to `api.deepgram.com`.
     */
    url?: string;
  };
  fetch?: FetchOptions;
  restProxy?: {
    url: null | string;
  };
}
