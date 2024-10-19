import { AgentEvents } from "../lib/enums/AgentEvents.js";
import type { AgentLiveSchema, SpeakModel } from "../lib/types";
import type { DeepgramClientOptions } from "../lib/types";
import { AbstractLiveClient } from "./AbstractLiveClient";

export class AgentLiveClient extends AbstractLiveClient {
  public namespace: string = "agent";

  constructor(options: DeepgramClientOptions, endpoint: string = ":version/agent") {
    super(options);
    /**
     * According to the docs, this is the correct base URL for the Agent API.
     * TODO: Make configurable for self-hosted customers.
     */
    this.baseUrl = "wss://agent.deepgram.com";

    /**
     * TODO: Not sure we should send the options here.
     * Think that needs to happen after Websocket is open.
     */
    this.connect({}, endpoint);
  }

  /**
   * Sets up the connection event handlers.
   * This method is responsible for handling the various events that can occur on the WebSocket connection, such as opening, closing, and receiving messages.
   * - When the connection is opened, it emits the `AgentEvents.Open` event.
   * - When the connection is closed, it emits the `AgentEvents.Close` event.
   * - When an error occurs on the connection, it emits the `AgentEvents.Error` event.
   * - When a message is received, it parses the message and emits the appropriate event based on the message type.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(AgentEvents.Open, this);
      };

      this.conn.onclose = (event: any) => {
        this.emit(AgentEvents.Close, event);
      };

      this.conn.onerror = (event: ErrorEvent) => {
        this.emit(AgentEvents.Error, event);
      };

      this.conn.onmessage = (event: MessageEvent) => {
        try {
          const data: any = JSON.parse(event.data.toString());

          if (data.type in AgentEvents) {
            this.emit(data.type, data);
          } else {
            this.emit(AgentEvents.Unhandled, data);
          }
        } catch (error) {
          this.emit(AgentEvents.Error, {
            event,
            message: "Unable to parse `data` as JSON.",
            error,
          });
        }
      };
    }
  }

  /**
   * To be called with your model configuration BEFORE sending
   * any audio data.
   * @param options - The SettingsConfiguration object.
   * @param options.audio.input.encoding - The encoding for your inbound (user) audio.
   * @param options.audio.input.sampleRate - The sample rate for your inbound (user) audio.
   * @param options.audio.output.encoding - The encoding for your outbound (agent) audio.
   * @param options.audio.output.sampleRate - The sample rate for your outbound (agent) audio.
   * @param options.audio.output.bitrate - The bitrate for your outbound (agent) audio.
   * @param options.audio.output.container - The container for your outbound (agent) audio.
   * @param options.agent.listen.model - The STT model to use for processing user audio.
   * @param options.agent.speak.model - The TTS model to use for generating agent audio.
   * @param options.agent.think.provider.type - The LLM provider to use.
   * @param options.agent.think.model - The LLM model to use.
   * @param options.agent.think.instructions - The instructions to provide to the LLM.
   * @param options.agent.think.functions - The functions to provide to the LLM.
   * @param options.context.messages - The message history to provide to the LLM (useful if a websocket connection is lost.)
   * @param options.context.replay - Whether to replay the last message if it was an assistant message.
   */
  public configure(options: AgentLiveSchema): void {
    this.send(JSON.stringify({ type: "SettingsConfiguration", options }));
  }

  /**
   * Provide new instructions to the LLM.
   * @param instructions - The instructions to provide.
   */
  public updateInstructions(instructions: string): void {
    this.send(JSON.stringify({ type: "UpdateInstructions", instructions }));
  }

  /**
   * Change the speak model.
   * @param model - The new model to use.
   */
  public updateSpeak(model: SpeakModel): void {
    this.send(JSON.stringify({ type: "UpdateSpeak", model }));
  }

  /**
   * Immediately trigger an agent message. If this message
   * is sent while the user is speaking, or while the server is in the
   * middle of sending audio, then the request will be ignored and an InjectionRefused
   * event will be emitted.
   * @example "Hold on while I look that up for you."
   * @example "Are you still on the line?"
   * @param message - The message to speak.
   */
  public injectAgentMessage(message: string): void {
    this.send(JSON.stringify({ type: "InjectAgentMessage", message }));
  }

  /**
   * Send a keepalive to avoid closing the websocket while you
   * are not transmitting audio. This should be sent at least
   * every 8 seconds.
   */
  public keepAlive(): void {
    this.send(JSON.stringify({ type: "KeepAlive" }));
  }
}
