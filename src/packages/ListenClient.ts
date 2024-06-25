import { AbstractClient } from "./AbstractClient";
import { ListenLiveClient } from "./ListenLiveClient";
import { ListenRestClient } from "./ListenRestClient";
import { LiveSchema } from "../lib/types";

/**
 * The `ListenClient` class extends the `AbstractClient` class and provides access to the "listen" namespace.
 * It exposes two methods:
 *
 * 1. `prerecorded()`: Returns a `ListenRestClient` instance for interacting with the prerecorded listen API.
 * 2. `live(transcriptionOptions: LiveSchema = {}, endpoint = ":version/listen")`: Returns a `ListenLiveClient` instance for interacting with the live listen API, with the provided transcription options and endpoint.
 */
export class ListenClient extends AbstractClient {
  public namespace: string = "listen";

  /**
   * Returns a `ListenRestClient` instance for interacting with the prerecorded listen API.
   */
  get prerecorded() {
    return new ListenRestClient(this.options);
  }

  /**
   * Returns a `ListenLiveClient` instance for interacting with the live listen API, with the provided transcription options and endpoint.
   * @param {LiveSchema} [transcriptionOptions={}] - The transcription options to use for the live listen API.
   * @param {string} [endpoint=":version/listen"] - The endpoint to use for the live listen API.
   * @returns {ListenLiveClient} - A `ListenLiveClient` instance for interacting with the live listen API.
   */
  public live(
    transcriptionOptions: LiveSchema = {},
    endpoint: string = ":version/listen"
  ): ListenLiveClient {
    return new ListenLiveClient(this.options, transcriptionOptions, endpoint);
  }
}
