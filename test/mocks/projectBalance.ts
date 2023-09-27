import { faker } from "@faker-js/faker";
import { GetProjectBalanceResponse } from "../../src/lib/types";

const projectBalance: GetProjectBalanceResponse = {
  balance_id: faker.string.uuid(),
  amount: faker.number.int(),
  units: faker.lorem.word(),
  purchase: faker.lorem.word(),
};

export default projectBalance;
