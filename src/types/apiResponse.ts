import { ApiMetadata } from "./apiMetadata";
import { Channel } from "./channel";

export type ApiResponse = {
  request_id?: string;
  metadata?: ApiMetadata;
  results?: {
    channels: Array<Channel>;
  };
};
