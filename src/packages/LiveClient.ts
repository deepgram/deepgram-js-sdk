import { appendSearchParams } from "../lib/helpers";
import { DeepgramError } from "../lib/errors";
import { LiveConnectionState } from "../lib/types/LiveConnectionState";
import { LiveTranscriptionEvents } from "../lib/types/LiveTranscriptionEvents";
import WebSocket, { EventEmitter } from "isomorphic-ws";
import type { LiveConfigOptions } from "../lib/types/LiveConfigOptions";
import type { LiveOptions } from "../lib/types/TranscriptionOptions";

export class LiveClient {
  private wsUrl: string;
  private headers: Record<string, string>;
  private ws?: (url: string, options: any) => WebSocket;

  constructor(
    wsUrl: string,
    headers: Record<string, string>,
    ws?: (url: string, options: any) => WebSocket
  ) {
    this.wsUrl = wsUrl;
    this.headers = headers;
    this.ws = ws;
  }

  public listen(options?: LiveOptions, endpoint = "v1/listen") {
    return new WsClient(this.wsUrl, this.headers, this.ws, options, endpoint);
  }
}

class WsClient extends EventEmitter {
  private _socket: WebSocket;

  constructor(
    wsUrl: string,
    headers: Record<string, string>,
    ws?: (url: string, options: any) => WebSocket,
    options?: LiveOptions,
    endpoint = "v1/listen"
  ) {
    super();

    if (!ws) throw new DeepgramError("Failed to get WebSocket");

    const transcriptionOptions: LiveOptions = { ...{}, ...options };
    const url = new URL(endpoint, wsUrl);
    appendSearchParams(url.searchParams, transcriptionOptions);

    this._socket = ws(url.toString(), { headers });

    this._socket.onopen = () => {
      this.emit(LiveTranscriptionEvents.Open, this);
    };

    this._socket.onclose = (event: WebSocket.CloseEvent) => {
      // changing the event.target to any to access the private _req property that isn't available on the WebSocket.CloseEvent type
      const newTarget: any = event.target;
      if (newTarget["_req"]) {
        const dgErrorIndex = newTarget["_req"].res.rawHeaders.indexOf("dg-error");
        event.reason = newTarget["_req"].res.rawHeaders[dgErrorIndex + 1];
      }
      this.emit(LiveTranscriptionEvents.Close, event);
    };

    this._socket.onerror = (event) => {
      this.emit(LiveTranscriptionEvents.Error, event);
    };

    this._socket.onmessage = (m) => {
      this.emit(LiveTranscriptionEvents.TranscriptReceived, m.data);
    };

    return this;
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
   */
  public send(data: string | ArrayBufferLike | ArrayBufferView): void {
    if (this._socket.readyState === LiveConnectionState.OPEN) {
      this._socket.send(data);
    } else {
      this.emit(LiveTranscriptionEvents.Error, "Could not send. Connection not open.");
    }
  }

  /**
   * Denote that you are finished sending audio and close
   * the websocket connection when transcription is finished
   */
  public finish(): void {
    this._socket.send(new Uint8Array(0));
  }
}
