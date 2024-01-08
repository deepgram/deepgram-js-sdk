import DeepgramClient from "./DeepgramClient";
import { DeepgramVersionError } from "./lib/errors";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * Major version fallback error
 */
class Deepgram {
  constructor(protected apiKey: string, protected apiUrl?: string, protected requireSSL?: boolean) {
    throw new DeepgramVersionError();
  }
}

/**
 * Creates a new Deepgram Client.
 */
const createClient = (apiKey: string, options: DeepgramClientOptions = {}): DeepgramClient => {
  return new DeepgramClient(apiKey, options);
};

export { createClient, DeepgramClient, Deepgram };

/**
 * Helpful exports.
 */
export * from "./packages";
export * from "./lib/types";
export * from "./lib/enums";
export * from "./lib/constants";
export * from "./lib/errors";
export * from "./lib/helpers";

/**
 * Captions. These will be tree-shaken if unused.
 *
 * @see https://github.com/deepgram/deepgram-node-captions
 *
 * import/export declarations don't do anything but set up an alias to the
 * exported variable, they do not count as a "use". Given their semantics,
 * they are tracked specially by any bundler and will not adversely affect
 * tree-shaking.
 */
export { webvtt, srt } from "@deepgram/captions";
