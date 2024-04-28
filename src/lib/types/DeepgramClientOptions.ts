import { FetchOptions } from "./Fetch";

export type IFetch = typeof fetch;
export type IWebSocket = typeof WebSocket;

/**
 * Configures the options for a Deepgram client.
 *
 * The `DeepgramClientOptions` interface defines the configuration options for a Deepgram client. It includes options for various namespaces, such as `global`, `listen`, `manage`, `onprem`, `read`, and `speak`. Each namespace has its own options for configuring the transport, including the URL, proxy, and options for the fetch and WebSocket clients.
 *
 * The `global` namespace is used to configure options that apply globally to the Deepgram client. The other namespaces are used to configure options specific to different Deepgram API endpoints.
 */
export interface DeepgramClientOptions {
  global?: NamespaceOptions;
  listen?: NamespaceOptions;
  manage?: NamespaceOptions;
  onprem?: NamespaceOptions;
  read?: NamespaceOptions;
  speak?: NamespaceOptions;

  /**
   * Support introductory format
   */
  [index: string]: any;
  // _experimentalCustomFetch?: Fetch;
  // restProxy?: {
  //   url: null | string;
  // };
}

interface TransportFetchOptions extends TransportOptions, FetchOptions {}

type TransportUrl = URL | string;

interface TransportOptions {
  url?: TransportUrl;
  proxy?: {
    url?: null | TransportUrl;
  };
}

interface ITransport<C, O> {
  client?: C;
  options?: O;
}
export interface NamespaceOptions {
  fetch?: ITransport<IFetch, TransportFetchOptions>;
  websocket?: ITransport<IWebSocket, TransportOptions>;
}

export type DefaultNamespaceOptions = {
  fetch: {
    options: { url: TransportUrl };
  };
  websocket: {
    options: { url: TransportUrl };
  };
} & NamespaceOptions;

export type DefaultClientOptions = {
  global: DefaultNamespaceOptions;
} & DeepgramClientOptions;
