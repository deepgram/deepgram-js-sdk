import { Balance } from "./balance";

export type BalanceList = {
  balances?: Array<Balance>;
  err_code?: string;
  err_msg?: string;
};
