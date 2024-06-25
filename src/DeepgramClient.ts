import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
} from "./packages";

/**
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, SelfHostedRestClient, ReadClient, and SpeakClient.
 *
 * @see https://github.com/deepgram/deepgram-js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the ListenClient, which provides access to the Deepgram API's listening functionality.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  /**
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's management functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram API's self-hosted functionality.
   *
   * @returns {OnPremClient} A new instance of the SelfHostedRestClient named as OnPremClient.
   * @deprecated use selfhosted() instead
   */
  get onprem(): OnPremClient {
    return this.selfhosted;
  }

  /**
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram API's self-hosted functionality.
   *
   * @returns {SelfHostedRestClient} A new instance of the SelfHostedRestClient.
   */
  get selfhosted(): SelfHostedRestClient {
    return new SelfHostedRestClient(this.options);
  }

  /**
   * Returns a new instance of the ReadClient, which provides access to the Deepgram API's reading functionality.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient {
    return new ReadClient(this.options);
  }

  /**
   * Returns a new instance of the SpeakClient, which provides access to the Deepgram API's speaking functionality.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
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
