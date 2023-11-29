import { AbstractClient } from "./AbstractClient";
import { LiveClient } from "./LiveClient";
import { LiveSchema } from "../lib/types";
import { PrerecordedClient } from "./PrerecordedClient";

export class ListenClient extends AbstractClient {
  get prerecorded() {
    return new PrerecordedClient(this.key, this.options);
  }

  public live(transcriptionOptions: LiveSchema, endpoint = "v1/listen") {
    return new LiveClient(this.key, this.options, transcriptionOptions, endpoint);
  }
}
