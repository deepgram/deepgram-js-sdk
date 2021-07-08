export type UsageRequestListOptions = {
  start?: string;
  end?: string;
  page?: number;
  limit?: number;
  status?: "succeeded" | "failed";
};
