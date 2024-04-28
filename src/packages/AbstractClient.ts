import { DEFAULT_OPTIONS } from "../lib/constants";
import { DeepgramError } from "../lib/errors";
import { applyDefaults } from "../lib/helpers";
import { DeepgramClientOptions } from "../lib/types";
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
export abstract class AbstractClient {
  public namespace: string = "global";
  protected namespaceOptions: DefaultNamespaceOptions;
  protected options: DefaultClientOptions;

  constructor(protected key: string, options: DeepgramClientOptions) {
    this.key = key;

    if (!key) {
      this.key = process.env.DEEPGRAM_API_KEY as string;
    }

    if (!this.key) {
      throw new DeepgramError("A deepgram API key is required");
    }

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
}
