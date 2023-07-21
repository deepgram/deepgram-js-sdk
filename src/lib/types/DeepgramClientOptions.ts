import type { Fetch } from "./Fetch";

export type DeepgramClientOptions = {
  global: {
    /**
     * A custom `fetch` implementation.
     */
    fetch?: Fetch;

    /**
     * Optional headers for initializing the client.
     */
    headers?: Record<string, string>;

    /**
     * The URL used to interact with production, On-prem and other Deepgram environments. Defaults to `https://api.deepgram.com`.
     */
    url: string;
  };
};
