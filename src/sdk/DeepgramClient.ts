import { DeepgramClient as CoreDeepgramClient } from "../core";
import { ListenClient } from "./ListenClient";
import type { DeepgramClientOptions } from "../core/lib/types";

/**
 * The SDK DeepgramClient that wraps the core client and adds enhanced functionality.
 *
 * This class maintains the exact same public API as the core DeepgramClient but adds
 * enhanced features like session supervision for realtime connections.
 */
export default class DeepgramClient extends CoreDeepgramClient {
  /**
   * Returns an enhanced ListenClient that provides supervision for v2 live connections.
   *
   * @returns {ListenClient} An enhanced ListenClient with v2 supervision capabilities.
   */
  get listen(): ListenClient {
    const client = new ListenClient(this.options);
    // Pass the version from this client to the child client
    client.version = this.version;
    return client;
  }

  // All other methods forward directly to the core client
  // (auth, manage, models, selfhosted, read, speak, agent remain unchanged)
}
