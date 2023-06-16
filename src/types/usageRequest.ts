import { UsageCallback } from "./usageCallback";
import { UsageRequestDetail } from "./usageRequestDetail";
import { UsageRequestMessage } from "./usageRequestMessage";

export type UsageRequest = {
  request_id: string;
  created: string;
  path: string;
  accessor: string;
  response?: UsageRequestDetail | UsageRequestMessage;
  callback?: UsageCallback;
  err_code?: string;
  err_msg?: string;
};
