import { SOCKET_STATES } from "../constants";

/**
 * @deprecated Since 3.4. use SOCKET_STATES for generic socket connection states.
 */
export enum LiveConnectionState {
  CONNECTING = SOCKET_STATES.connecting,
  OPEN = SOCKET_STATES.open,
  CLOSING = SOCKET_STATES.closing,
  CLOSED = SOCKET_STATES.closed,
}
