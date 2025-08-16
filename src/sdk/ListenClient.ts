import { ListenClient as CoreListenClient } from "../core/packages/ListenClient";
import { ListenLiveClient as CoreListenLiveClient } from "../core/packages/ListenLiveClient";
import { Supervisor, type SupervisorConfig } from "./supervisor/Supervisor";
import type { MiddlewareContext } from "./middleware/types";
import type { LiveSchema } from "../core/lib/types";

/**
 * Enhanced ListenClient that wraps the core ListenClient and adds v2 supervision
 */
export class ListenClient extends CoreListenClient {
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

    if (this.shouldSupervise("v2")) {
      this.attachListenV2Supervision(coreClient);
    }

    return coreClient;
  }

  /**
   * Attach supervision to a Listen live client session
   */
  private attachListenV2Supervision(session: CoreListenLiveClient): void {
    const config: SupervisorConfig = {
      clientType: "listen",
      version: this.version,
      middlewares: [
        {
          event: "SpeechStarted",
          before: (payload: any, ctx: MiddlewareContext) => {
            console.log("before:SpeechStarted", payload, ctx);
          },
          after: (payload: any, ctx: MiddlewareContext) => {
            console.log("after:SpeechStarted", payload, ctx);
          },
        },
      ],
    };

    Supervisor.attach(session, config);
  }

  /**
   * Determine if a session should be supervised based on endpoint and version
   */
  private shouldSupervise(version: string): boolean {
    const isV2 = this.version === version;
    return isV2;
  }
}
