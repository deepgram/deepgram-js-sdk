import { DeepgramVersionError, DeepgramError } from "./lib/errors";
import {
  AbstractClient,
  AgentLiveClient,
  AuthRestClient,
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
  ModelsRestClient,
} from "./packages";

/**
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, SelfHostedRestClient, ReadClient, and SpeakClient.
 *
 * @see https://github.com/deepgram/deepgram-js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Supported API versions for different features
   */
  private static readonly SUPPORTED_VERSIONS = {
    listen: ["v1", "v2"], // Listen supports both v1 and v2
    speak: ["v1"], // Speak only supports v1 currently
    read: ["v1"], // Read only supports v1 currently
    manage: ["v1"], // Management API only supports v1
    models: ["v1"], // Models API only supports v1
    auth: ["v1"], // Auth API only supports v1
    selfhosted: ["v1"], // Self-hosted only supports v1
    agent: ["v1"], // Agent API only supports v1 currently
  };

  /**
   * Validates if a version is supported for a specific API
   */
  private validateVersion(api: string, version: string): void {
    // First check if the version exists at all
    const allSupportedVersions = new Set<string>();
    Object.values(DeepgramClient.SUPPORTED_VERSIONS).forEach((versions) => {
      versions.forEach((v) => allSupportedVersions.add(v));
    });

    if (!allSupportedVersions.has(version)) {
      throw new DeepgramError(
        `Version '${version}' is not supported by any API. Available versions: ${Array.from(
          allSupportedVersions
        ).join(", ")}`
      );
    }

    // Then check if it's supported for this specific API
    const supportedVersions =
      DeepgramClient.SUPPORTED_VERSIONS[api as keyof typeof DeepgramClient.SUPPORTED_VERSIONS];
    if (!supportedVersions.includes(version)) {
      throw new DeepgramError(
        `Version '${version}' is not supported for ${api} API. Supported versions: ${supportedVersions.join(
          ", "
        )}`
      );
    }
  }
  /**
   * Returns a new instance of the AuthRestClient, which provides access to the Deepgram API's temporary token endpoints.
   *
   * @returns {AuthRestClient} A new instance of the AuthRestClient.
   * @see https://developers.deepgram.com/reference/token-based-auth-api/grant-token
   */
  get auth(): AuthRestClient {
    this.validateVersion("auth", this.version);
    return new AuthRestClient(this.options);
  }
  /**
   * Returns a new instance of the ListenClient, which provides access to the Deepgram API's listening functionality.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient {
    this.validateVersion("listen", this.version);
    return new ListenClient(this.options);
  }

  /**
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's management functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    this.validateVersion("manage", this.version);
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the ModelsRestClient, which provides access to the Deepgram API's model functionality.
   *
   * @returns {ModelsRestClient} A new instance of the ModelsRestClient.
   */
  get models(): ModelsRestClient {
    this.validateVersion("models", this.version);
    return new ModelsRestClient(this.options);
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
    this.validateVersion("selfhosted", this.version);
    return new SelfHostedRestClient(this.options);
  }

  /**
   * Returns a new instance of the ReadClient, which provides access to the Deepgram API's reading functionality.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient {
    this.validateVersion("read", this.version);
    return new ReadClient(this.options);
  }

  /**
   * Returns a new instance of the SpeakClient, which provides access to the Deepgram API's speaking functionality.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient {
    this.validateVersion("speak", this.version);
    return new SpeakClient(this.options);
  }

  /**
   * Returns a new instance of the AgentLiveClient, which provides access to Deepgram's Voice Agent API.
   *
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient.
   * @beta
   */
  public agent(endpoint: string = "/:version/agent/converse"): AgentLiveClient {
    this.validateVersion("agent", this.version);
    return new AgentLiveClient(this.options, endpoint);
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
