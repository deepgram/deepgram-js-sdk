import { DeepgramVersionError } from "../core/lib/errors";
import DeepgramClient from "./DeepgramClient";
import type { DeepgramClientOptions, IKeyFactory } from "../core/lib/types";

/**
 * This class is deprecated and should not be used. It throws a `DeepgramVersionError` when instantiated.
 *
 * @deprecated
 * @see https://dpgr.am/js-v3
 */
class Deepgram {
  constructor(protected apiKey: string, protected apiUrl?: string, protected requireSSL?: boolean) {
    throw new DeepgramVersionError();
  }
}

/**
 * Creates a new Deepgram client instance with enhanced SDK features.
 *
 * @param {DeepgramClientArgs} args - Arguments to pass to the Deepgram client constructor.
 * @returns A new enhanced Deepgram client instance.
 */
function createClient(): DeepgramClient;
function createClient(key?: string | IKeyFactory): DeepgramClient;
function createClient(options?: DeepgramClientOptions): DeepgramClient;
function createClient(key?: string | IKeyFactory, options?: DeepgramClientOptions): DeepgramClient;
function createClient(
  keyOrOptions?: string | IKeyFactory | DeepgramClientOptions,
  options?: DeepgramClientOptions
): DeepgramClient {
  let resolvedOptions: DeepgramClientOptions = {};

  if (typeof keyOrOptions === "string" || typeof keyOrOptions === "function") {
    if (typeof options === "object") {
      resolvedOptions = options;
    }

    resolvedOptions.key = keyOrOptions;
  } else if (typeof keyOrOptions === "object") {
    resolvedOptions = keyOrOptions;
  }

  return new DeepgramClient(resolvedOptions);
}

export { createClient, DeepgramClient, Deepgram };

/**
 * Re-export all core functionality for backward compatibility
 */
export * from "../core/packages";
export * from "../core/lib/types";
export * from "../core/lib/enums";
export * from "../core/lib/constants";
export * from "../core/lib/errors";
export * from "../core/lib/helpers";

/**
 * Export SDK-specific functionality
 */
export { ListenV2 } from "./listen/ListenV2Supervisor";
export type { ListenV2Middleware, MiddlewareContext, SessionPlugin } from "./middleware/types";

/**
 * Captions. These will be tree-shaken if unused.
 *
 * @see https://github.com/deepgram/deepgram-node-captions
 */
export { webvtt, srt } from "@deepgram/captions";
