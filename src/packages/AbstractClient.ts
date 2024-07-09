import { EventEmitter } from "events";
import { DEFAULT_OPTIONS, DEFAULT_URL } from "../lib/constants";
import { DeepgramError } from "../lib/errors";
import { appendSearchParams, applyDefaults, convertLegacyOptions } from "../lib/helpers";
import type {
  DeepgramClientOptions,
  DefaultClientOptions,
  DefaultNamespaceOptions,
  NamespaceOptions,
} from "../lib/types";

export const noop = () => {};

/**
 * Represents an abstract Deepgram client that provides a base implementation for interacting with the Deepgram API.
 *
 * The `AbstractClient` class is responsible for:
 * - Initializing the Deepgram API key
 * - Applying default options for the client and namespace
 * - Providing a namespace for organizing API requests
 *
 * Subclasses of `AbstractClient` should implement the specific functionality for interacting with the Deepgram API.
 */
export abstract class AbstractClient extends EventEmitter {
  protected factory: Function | undefined = undefined;
  protected key: string;
  protected options: DefaultClientOptions;
  public namespace: string = "global";
  public version: string = "v1";
  public baseUrl: string = DEFAULT_URL;
  public logger: Function = noop;

  /**
   * Constructs a new instance of the DeepgramClient class with the provided options.
   *
   * @param options - The options to configure the DeepgramClient instance.
   * @param options.key - The Deepgram API key to use for authentication. If not provided, the `DEEPGRAM_API_KEY` environment variable will be used.
   * @param options.global - Global options that apply to all requests made by the DeepgramClient instance.
   * @param options.global.fetch - Options to configure the fetch requests made by the DeepgramClient instance.
   * @param options.global.fetch.options - Additional options to pass to the fetch function, such as `url` and `headers`.
   * @param options.namespace - Options specific to a particular namespace within the DeepgramClient instance.
   */
  constructor(options: DeepgramClientOptions) {
    super();

    let key;

    if (typeof options.key === "function") {
      this.factory = options.key;
      key = this.factory();
    } else {
      key = options.key;
    }

    if (!key) {
      key = process.env.DEEPGRAM_API_KEY as string;
    }

    if (!key) {
      throw new DeepgramError("A deepgram API key is required.");
    }

    this.key = key;

    options = convertLegacyOptions(options);

    /**
     * Apply default options.
     */
    this.options = applyDefaults<DeepgramClientOptions, DefaultClientOptions>(
      options,
      DEFAULT_OPTIONS
    );
  }

  /**
   * Sets the version for the current instance of the Deepgram API and returns the instance.
   *
   * @param version - The version to set for the Deepgram API instance. Defaults to "v1" if not provided.
   * @returns The current instance of the AbstractClient with the updated version.
   */
  public v(version: string = "v1"): this {
    this.version = version;

    return this;
  }

  /**
   * Gets the namespace options for the current instance of the AbstractClient.
   * The namespace options include the default options merged with the global options,
   * and the API key for the current instance.
   *
   * @returns The namespace options for the current instance.
   */
  get namespaceOptions(): DefaultNamespaceOptions {
    const defaults = applyDefaults<NamespaceOptions, DefaultNamespaceOptions>(
      (this.options as any)[this.namespace],
      this.options.global
    );

    return {
      ...defaults,
      key: this.key,
    };
  }

  /**
   * Generates a URL for an API endpoint with optional query parameters and transcription options.
   *
   * @param endpoint - The API endpoint URL, which may contain placeholders for fields.
   * @param fields - An optional object containing key-value pairs to replace placeholders in the endpoint URL.
   * @param transcriptionOptions - Optional transcription options to include as query parameters in the URL.
   * @returns A URL object representing the constructed API request URL.
   */
  public getRequestUrl(
    endpoint: string,
    fields: { [key: string]: string } = { version: this.version },
    transcriptionOptions?: {
      [key: string]: unknown;
    }
  ): URL {
    /**
     * If we pass in fields without a version, set a version.
     */
    fields.version = this.version;

    /**
     * Version and template the endpoint for input argument..
     */
    endpoint = endpoint.replace(/:(\w+)/g, function (_, key) {
      return fields![key];
    });

    /**
     * Create a URL object.
     */
    const url = new URL(endpoint as string, this.baseUrl);

    /**
     * If there are transcription options, append them to the request as URL querystring parameters
     */
    if (transcriptionOptions) {
      appendSearchParams(url.searchParams, transcriptionOptions);
    }

    return url;
  }

  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  public log(kind: string, msg: string, data?: any) {
    this.logger(kind, msg, data);
  }
}
