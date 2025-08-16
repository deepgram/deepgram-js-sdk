import { ListenClient as CoreListenClient } from "../core/packages/ListenClient";
import { ListenLiveClient as CoreListenLiveClient } from "../core/packages/ListenLiveClient";
import { ListenRestClient } from "../core/packages/ListenRestClient";
import { ListenV2Supervisor } from "./listen/ListenV2Supervisor";
import type { DeepgramClientOptions, LiveSchema } from "../core/lib/types";

/**
 * Enhanced ListenClient that wraps the core ListenClient and adds v2 supervision
 */
export class ListenClient extends CoreListenClient {
  /**
   * Returns a ListenRestClient for prerecorded transcription (unchanged from core)
   */
  get prerecorded() {
    return new ListenRestClient(this.options);
  }

  /**
   * Creates a live transcription connection with optional v2 supervision
   *
   * @param transcriptionOptions - The transcription options
   * @param endpoint - The WebSocket endpoint (defaults to ":version/listen")
   * @returns A ListenLiveClient with v2 supervision if applicable
   */
  public live(
    transcriptionOptions: LiveSchema = {},
    endpoint: string = ":version/listen"
  ): CoreListenLiveClient {
    // Create the core live client
    const coreClient = new CoreListenLiveClient(this.options, transcriptionOptions, endpoint);

    // Check if this should be supervised (Listen v2)
    if (this.shouldSupervise(endpoint)) {
      // Attach v2 supervision (turn counting, reconnection, middleware)
      ListenV2Supervisor.attach(coreClient);
    }

    return coreClient;
  }

  /**
   * Determine if a session should be supervised based on endpoint and version
   */
  private shouldSupervise(endpoint: string): boolean {
    // Resolve the endpoint template with current version
    const resolvedEndpoint = endpoint.replace(":version", this.version);

    // Supervise if:
    // 1. Version is explicitly v2, OR
    // 2. Resolved endpoint ends with /v2/listen
    const isV2 = this.version === "v2" || resolvedEndpoint.endsWith("/v2/listen");

    // Debug logging for tests
    if (process.env.NODE_ENV === "test") {
      console.log(
        `shouldSupervise: version=${this.version}, endpoint=${endpoint}, resolved=${resolvedEndpoint}, isV2=${isV2}`
      );
    }

    return isV2;
  }
}
