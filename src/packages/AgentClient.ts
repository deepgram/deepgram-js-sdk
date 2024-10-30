import { AbstractClient } from "./AbstractClient";
import { AgentLiveClient } from "./AgentLiveClient";

/**
 * The `AgentClient` class extends the `AbstractClient` class and provides access to the "agent" namespace.
 * It exposes one method:
 *
 * `live(ttsOptions: SpeakSchema = {}, endpoint = ":version/speak")`: Returns an `AgentLiveClient` instance for interacting with the voice agent API.
 */
export class AgentClient extends AbstractClient {
  public namespace: string = "agent";

  /**
   * Returns an `AgentLiveClient` instance for interacting with the voice agent API.
   * @param {string} [endpoint="/agent"] - The endpoint to use for the live speak API.
   * @returns {SpeakLiveClient} - A `SpeakLiveClient` instance for interacting with the live speak API.
   */
  public live(endpoint: string = "/agent"): AgentLiveClient {
    return new AgentLiveClient(this.options, endpoint);
  }
}
