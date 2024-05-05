import { AbstractLiveClient } from "./AbstractLiveClient";
import { DeepgramError } from "../lib/errors";
import { LiveConnectionState, LiveTranscriptionEvents } from "../lib/enums";

import {
  type LiveSchema,
  type LiveConfigOptions,
  type LiveMetadataEvent,
  type LiveTranscriptionEvent,
  type DeepgramClientOptions,
  type UtteranceEndEvent,
  type SpeechStartedEvent,
} from "../lib/types";

export class LiveClient extends AbstractLiveClient {
  public namespace: string = "listen";

  // Constructor implementation
  constructor(
    options: DeepgramClientOptions,
    transcriptionOptions: LiveSchema = {},
    endpoint: string = ":version/listen"
  ) {
    super(options);
  }
}
