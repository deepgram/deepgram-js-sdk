import { DeepgramVersionError } from "./lib/errors";
import DeepgramClient from "./DeepgramClient";

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

export { DeepgramClient, Deepgram };

/**
 * Core exports - all the low-level functionality
 */
export * from "./packages";
export * from "./lib/types";
export * from "./lib/enums";
export * from "./lib/constants";
export * from "./lib/errors";
export * from "./lib/helpers";
export * from "./lib/version";

/**
 * Captions. These will be tree-shaken if unused.
 *
 * @see https://github.com/deepgram/deepgram-node-captions
 */
export { webvtt, srt } from "@deepgram/captions";
