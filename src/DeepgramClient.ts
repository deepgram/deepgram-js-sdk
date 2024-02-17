import { DeepgramVersionError } from "./lib/errors";
import { AbstractClient } from "./packages/AbstractClient";
import { ListenClient } from "./packages/ListenClient";
import { ManageClient } from "./packages/ManageClient";
import { OnPremClient } from "./packages/OnPremClient";
import { ReadClient } from "./packages/ReadClient";
import { SpeakClient } from "./packages/SpeakClient";

/**
 * Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 * @see https://developers.deepgram.com/docs/js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  get listen(): ListenClient {
    return new ListenClient(this.key, this.options);
  }

  get manage(): ManageClient {
    return new ManageClient(this.key, this.options);
  }

  get onprem(): OnPremClient {
    return new OnPremClient(this.key, this.options);
  }

  get read(): ReadClient {
    return new ReadClient(this.key, this.options);
  }

  get speak(): SpeakClient {
    return new SpeakClient(this.key, this.options);
  }

  /**
   * Major version fallback errors are below
   *
   * @see https://developers.deepgram.com/docs/js-sdk-v2-to-v3-migration-guide
   */
  get transcription(): any {
    throw new DeepgramVersionError();
  }

  get projects(): any {
    throw new DeepgramVersionError();
  }

  get keys(): any {
    throw new DeepgramVersionError();
  }

  get members(): any {
    throw new DeepgramVersionError();
  }

  get scopes(): any {
    throw new DeepgramVersionError();
  }

  get invitation(): any {
    throw new DeepgramVersionError();
  }

  get usage(): any {
    throw new DeepgramVersionError();
  }

  get billing(): any {
    throw new DeepgramVersionError();
  }
}
