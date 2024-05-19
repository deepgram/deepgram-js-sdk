import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  ListenClient,
  ManageClient,
  ReadClient,
  SelfHostedClient as OnPremClient,
  SelfHostedClient,
  SpeakClient,
} from "./packages";

/**
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, SelfHostedClient, ReadClient, and SpeakClient.
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

  /**
   * backwards compatibility for renaming onprem to selfhosted
   * @deprecated
   */
  get onprem(): OnPremClient {
    return this.selfhosted;
  }

  get selfhosted(): SelfHostedClient {
    return new SelfHostedClient(this.options);
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
