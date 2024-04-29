import { FetchOptions } from "./Fetch";

export type IKeyFactory = () => string;
export type IFetch = typeof fetch;
export type IWebSocket = typeof WebSocket;

/**
 * Defines the arguments for creating a Deepgram client.
 *
 * The `DeepgramClientArgs` type represents the possible arguments that can be passed when creating a Deepgram client. It can be either:
 *
 * 1. An array with two elements:
 *    - The first element is a string or an `IKeyFactory` object, representing the API key.
 *    - The second element is a `DeepgramClientOptions` object, representing the configuration options for the Deepgram client.
 * 2. An array with a single `DeepgramClientOptions` object, representing the configuration options for the Deepgram client.
 */

/**
 * Configures the options for a Deepgram client.
 *
 * The `DeepgramClientOptions` interface defines the configuration options for a Deepgram client. It includes options for various namespaces, such as `global`, `listen`, `manage`, `onprem`, `read`, and `speak`. Each namespace has its own options for configuring the transport, including the URL, proxy, and options for the fetch and WebSocket clients.
 *
 * The `global` namespace is used to configure options that apply globally to the Deepgram client. The other namespaces are used to configure options specific to different Deepgram API endpoints.
 */
export interface DeepgramClientOptions {
  key?: string | IKeyFactory;
  global?: NamespaceOptions & { url?: string; headers?: { [index: string]: any } };
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
interface TransportWebSocketOptions extends TransportOptions {
  _nodeOnlyHeaders?: { [index: string]: any };
}

type TransportUrl = string;

interface TransportOptions {
  url?: TransportUrl;
  proxy?: {
    url: TransportUrl;
  };
}

interface ITransport<C, O> {
  client?: C;
  options?: O;
}
export interface NamespaceOptions {
  fetch?: ITransport<IFetch, TransportFetchOptions>;
  websocket?: ITransport<IWebSocket, TransportWebSocketOptions>;
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
