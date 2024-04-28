import { DeepgramClientOptions } from "../lib/types";
import { AbstractClient } from "./AbstractClient";

export abstract class AbstractLiveClient extends AbstractClient {
  constructor(protected key: string, options: DeepgramClientOptions) {
    super(key, options);
  }
}
