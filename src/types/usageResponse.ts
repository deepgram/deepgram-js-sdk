import { UsageResponseDetail } from "./usageResponseDetail";

export type UsageResponse = {
  start: string;
  end: string;
  resolution: {
    units: string;
    amount: number;
  };
  results: Array<UsageResponseDetail>;
};
