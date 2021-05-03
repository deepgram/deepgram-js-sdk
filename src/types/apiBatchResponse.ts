import { ApiMetadata } from "./apiMetadata";
import { Channel } from "./channel";

export type ApiBatchResponse = {
  request_id?: string;
  metadata?: ApiMetadata;
  results?: {
    channels: Array<Channel>;
  };
};
