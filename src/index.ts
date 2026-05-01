// Export everything under Deepgram namespace for backwards compatibility
export * as Deepgram from "./api/index.js";

// ALSO export all types directly for better discoverability and IDE autocomplete
// This allows: import { ListenV1Response } from "@deepgram/sdk"
// While still supporting: import { Deepgram } from "@deepgram/sdk"; type Response = Deepgram.ListenV1Response;
export * from "./api/types/index.js";
export * from "./api/resources/index.js";

// Core client exports
export type { BaseClientOptions, BaseRequestOptions } from "./BaseClient.js";
export { DeepgramClient as DefaultDeepgramClient } from "./Client.js";
export { CustomDeepgramClient as DeepgramClient } from "./CustomClient.js";
export type { CustomDeepgramClientOptions } from "./CustomClient.js";
export { DeepgramEnvironment, type DeepgramEnvironmentUrls } from "./environments.js";
export { DeepgramError, DeepgramTimeoutError } from "./errors/index.js";
export * from "./transport.js";
export * from "./exports.js";
