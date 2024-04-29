import { DeepgramVersionError } from "./lib/errors";
import { AbstractClient } from "./packages/AbstractClient";
import { ListenClient } from "./packages/ListenClient";
import { ManageClient } from "./packages/ManageClient";
import { OnPremClient } from "./packages/OnPremClient";
import { ReadClient } from "./packages/ReadClient";
import { SpeakClient } from "./packages/SpeakClient";

/**
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, OnPremClient, ReadClient, and SpeakClient.
 *
 * @see https://github.com/deepgram/deepgram-js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  get onprem(): OnPremClient {
    return new OnPremClient(this.options);
  }

  get read(): ReadClient {
    return new ReadClient(this.options);
  }

  get speak(): SpeakClient {
    return new SpeakClient(this.options);
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get transcription(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get projects(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get keys(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get members(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get scopes(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get invitation(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get usage(): any {
    throw new DeepgramVersionError();
  }

  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get billing(): any {
    throw new DeepgramVersionError();
  }
}
