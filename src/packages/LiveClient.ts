import { AbstractWsClient } from "./AbstractWsClient";
import { appendSearchParams } from "../lib/helpers";
import { DeepgramError } from "../lib/errors";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { LiveConnectionState, LiveTranscriptionEvents } from "../lib/enums";
import { w3cwebsocket } from "websocket";

import type {
  LiveSchema,
  LiveConfigOptions,
  LiveMetadataEvent,
  LiveTranscriptionEvent,
  DeepgramClientOptions,
  UtteranceEndEvent,
  SpeechStartedEvent,
} from "../lib/types";

export class LiveClient extends AbstractWsClient {
  private _socket: w3cwebsocket;

  constructor(
    protected key: string,
    protected options: DeepgramClientOptions | undefined = DEFAULT_OPTIONS,
    private transcriptionOptions: LiveSchema = {},
    endpoint = "v1/listen"
  ) {
    super(key, options);

    const url = new URL(endpoint, this.baseUrl);
    url.protocol = url.protocol.toLowerCase().replace(/(http)(s)?/gi, "ws$2");
    appendSearchParams(url.searchParams, this.transcriptionOptions);

    this._socket = new w3cwebsocket(url.toString(), ["token", this.key]);

    this._socket.onopen = () => {
      this.emit(LiveTranscriptionEvents.Open, this);
    };

    this._socket.onclose = (event: any) => {
      this.emit(LiveTranscriptionEvents.Close, event);
    };

    this._socket.onerror = (event) => {
      this.emit(LiveTranscriptionEvents.Error, event);
    };

    this._socket.onmessage = (event) => {
      try {
        const data: any = JSON.parse(event.data.toString());

        if (data.type === LiveTranscriptionEvents.Metadata) {
          this.emit(LiveTranscriptionEvents.Metadata, data as LiveMetadataEvent);
        }

        if (data.type === LiveTranscriptionEvents.Transcript) {
          this.emit(LiveTranscriptionEvents.Transcript, data as LiveTranscriptionEvent);
        }

        if (data.type === LiveTranscriptionEvents.UtteranceEnd) {
          this.emit(LiveTranscriptionEvents.UtteranceEnd, data as UtteranceEndEvent);
        }

        if (data.type === LiveTranscriptionEvents.SpeechStarted) {
          this.emit(LiveTranscriptionEvents.SpeechStarted, data as SpeechStartedEvent);
        }
      } catch (error) {
        this.emit(LiveTranscriptionEvents.Error, {
          event,
          message: "Unable to parse `data` as JSON.",
          error,
        });
      }
    };
  }

  public configure(config: LiveConfigOptions): void {
    this._socket.send(
      JSON.stringify({
        type: "Configure",
        processors: config,
      })
    );
  }

  public keepAlive(): void {
    this._socket.send(
      JSON.stringify({
        type: "KeepAlive",
      })
    );
  }

  public getReadyState(): LiveConnectionState {
    return this._socket.readyState;
  }

  /**
   * Sends data to the Deepgram API via websocket connection
   * @param data Audio data to send to Deepgram
   *
   * Conforms to RFC #146 for Node.js - does not send an empty byte.
   * In the browser, a Blob will contain length with no audio.
   * @see https://github.com/deepgram/deepgram-python-sdk/issues/146
   */
  public send(data: string | ArrayBufferLike | Blob): void {
    if (this._socket.readyState === LiveConnectionState.OPEN) {
      if (typeof data === "string") {
        this._socket.send(data); // send text data
      } else if ((data as any) instanceof Blob) {
        this._socket.send(data as unknown as ArrayBufferLike); // send blob data
      } else {
        const buffer = data as ArrayBufferLike;

        if (buffer.byteLength > 0) {
          this._socket.send(buffer); // send buffer when not zero-byte (or browser)
        } else {
          this.emit(
            LiveTranscriptionEvents.Warning,
            "Zero-byte detected, skipping. Send `CloseStream` if trying to close the connection."
          );
        }
      }
    } else {
      throw new DeepgramError("Could not send. Connection not open.");
    }
  }

  /**
   * Denote that you are finished sending audio and close
   * the websocket connection when transcription is finished
   */
  public finish(): void {
    // tell the server to close the socket
    this._socket.send(
      JSON.stringify({
        type: "CloseStream",
      })
    );
  }
}
