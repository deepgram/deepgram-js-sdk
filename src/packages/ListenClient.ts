import { AbstractClient } from "./AbstractClient";
import { ListenLiveClient } from "./ListenLiveClient";
import { LiveSchema } from "../lib/types";
import { ListenRestClient } from "./ListenRestClient";

export class ListenClient extends AbstractClient {
  public namespace: string = "listen";

  get prerecorded() {
    return new ListenRestClient(this.options);
  }

  public live(transcriptionOptions: LiveSchema = {}, endpoint = ":version/listen") {
    return new ListenLiveClient(this.options, transcriptionOptions, endpoint);
  }
}
