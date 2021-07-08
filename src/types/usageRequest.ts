import { UsageCallback } from "./usageCallback";
import { UsageRequestDetail } from "./usageRequestDetail";
import { UsageRequestMessage } from "./usageRequestMessage";

export type UsageRequest = {
  id: string;
  created: string;
  path: string;
  accessor: string;
  response?: UsageRequestDetail | UsageRequestMessage;
  callback?: UsageCallback;
};
