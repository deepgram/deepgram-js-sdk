import { AbstractClient } from "./AbstractClient";
import { LiveClient } from "./LiveClient";
import { LiveSchema } from "../lib/types";
import { PrerecordedClient } from "./PrerecordedClient";

export class ListenClient extends AbstractClient {
  public namespace: string = "listen";

  get prerecorded() {
    return new PrerecordedClient(this.options);
  }

  public live(transcriptionOptions: LiveSchema = {}, endpoint = ":version/listen") {
    return new LiveClient(this.options, transcriptionOptions, endpoint);
  }
}
