import EventEmitter from "events";
import querystring from "querystring";
import WebSocket from "ws";
import { ConnectionState, LiveTranscriptionEvents } from "../enums";
import { LiveTranscriptionOptions } from "../types";
import { userAgent } from "../userAgent";

export class LiveTranscription extends EventEmitter {
  private _socket: WebSocket;

  constructor(
    credentials: string,
    apiUrl: string,
    options?: LiveTranscriptionOptions
  ) {
    super(undefined);
    this._socket = new WebSocket(
      `wss://${apiUrl}/v1/listen?${querystring.stringify(options)}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "User-Agent": userAgent(),
        },
      }
    );
    this._bindSocketEvents();
  }

  private _bindSocketEvents(): void {
    this._socket.onopen = () => {
      this.emit(LiveTranscriptionEvents.Open, this);
    };

    this._socket.onclose = (event: WebSocket.CloseEvent) => {
      this.emit(LiveTranscriptionEvents.Close, event);
    };

    this._socket.onerror = (event) => {
      this.emit(LiveTranscriptionEvents.Error, event);
    };

    this._socket.onmessage = (m) => {
      this.emit(LiveTranscriptionEvents.TranscriptReceived, m);
    };
  }

  /**
   * Returns the ready state of the websocket connection
   */
  public getReadyState(): ConnectionState {
    return this._socket.readyState;
  }

  /**
   * Sends data to the Deepgram API via websocket connection
   * @param data Audio data to send to Deepgram
   */
  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this._socket.readyState === ConnectionState.OPEN) {
      this._socket.send(data);
    } else {
      this.emit(
        LiveTranscriptionEvents.Error,
        "Could not send. Connection not open."
      );
    }
  }

  /**
   * Denote that you are finished sending audio and close
   * the websocket connection when transcription is finished
   */
  public finish(): void {
    this._socket.close(1000);
  }
}
