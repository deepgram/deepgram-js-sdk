import EventEmitter from "events";
import { DEFAULT_OPTIONS, DEFAULT_URL } from "../lib/constants";
import { DeepgramError } from "../lib/errors";
import { appendSearchParams, applyDefaults, convertLegacyOptions } from "../lib/helpers";
import { DeepgramClientOptions, LiveSchema, TranscriptionSchema } from "../lib/types";
import {
  DefaultClientOptions,
  DefaultNamespaceOptions,
  NamespaceOptions,
} from "../lib/types/DeepgramClientOptions";

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
  protected namespaceOptions: DefaultNamespaceOptions;
  protected options: DefaultClientOptions;
  public namespace: string = "global";
  public version: string = "v1";
  public baseUrl: string = DEFAULT_URL;

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

    /**
     * Roll up options for this namespace.
     */
    this.namespaceOptions = applyDefaults<NamespaceOptions, DefaultNamespaceOptions>(
      this.options[this.namespace],
      this.options.global!
    );
  }

  public v(version: string = "v1"): this {
    this.version = version;

    return this;
  }

  /**
   * Determines whether the current instance should proxy requests.
   * @returns {boolean} true if the current instance should proxy requests; otherwise, false
   */
  get proxy(): boolean {
    return this.key === "proxy" && !!this.namespaceOptions.fetch.options.proxy?.url;
  }

  /**
   * Generates a URL for the specified endpoint and transcription options.
   *
   * @param endpoint - The endpoint URL, which may contain a "{version}" placeholder that will be replaced with the client's version.
   * @param transcriptionOptions - The transcription options to include as query parameters in the URL.
   * @returns A URL object representing the generated URL.
   */
  public getRequestUrl(
    endpoint: string,
    transcriptionOptions: LiveSchema | TranscriptionSchema
  ): URL {
    /**
     * Version the URL endpoints if they can be versioned.
     */
    endpoint = endpoint.replace("{version}", this.version);

    const url = new URL(endpoint as string, this.baseUrl);
    appendSearchParams(url.searchParams, transcriptionOptions);

    return url;
  }
}
