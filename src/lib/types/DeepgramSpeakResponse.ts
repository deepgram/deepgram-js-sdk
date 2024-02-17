import { DeepgramError } from "../errors";

export type DeepgramSpeakResponse = ReadableStream | ErrorResponse;

interface ErrorResponse {
  error: DeepgramError;
}
