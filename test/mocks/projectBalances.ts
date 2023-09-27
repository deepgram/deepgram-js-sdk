import { GetProjectBalancesResponse } from "../../src/lib/types";
import projectBalance from "./projectBalance";

const projectBalances: GetProjectBalancesResponse = {
  balances: [projectBalance],
};

export default projectBalances;
