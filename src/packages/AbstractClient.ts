import EventEmitter from "events";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { DeepgramError } from "../lib/errors";
import { applyDefaults } from "../lib/helpers";
import { DeepgramClientOptions } from "../lib/types";
import merge from "deepmerge";
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
  public version: number = 1;

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

    const convertLegacyOptions = (optionsArg: DeepgramClientOptions): DeepgramClientOptions => {
      const newOptions: DeepgramClientOptions = {};

      if (optionsArg.global?.url) {
        newOptions.global = {
          fetch: {
            options: {
              url: optionsArg.global.url,
            },
          },
        };
      }

      if (optionsArg.global?.headers) {
        newOptions.global = {
          fetch: {
            options: {
              headers: optionsArg.global?.headers,
            },
          },
        };
      }

      return merge(optionsArg, newOptions);
    };

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

  public v(version: number = 1) {
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
}
