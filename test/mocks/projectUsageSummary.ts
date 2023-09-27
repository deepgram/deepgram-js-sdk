import { GetProjectUsageSummaryResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const usageSummary = {
  start: faker.date.anytime().toISOString(),
  end: faker.date.anytime().toISOString(),
  hours: faker.number.int(),
  total_hours: faker.number.int(),
  requests: faker.number.int(),
};

const projectUsageSummary: GetProjectUsageSummaryResponse = {
  start: faker.date.anytime().toISOString(),
  end: faker.date.anytime().toISOString(),
  resolution: {
    units: faker.lorem.words(5),
    amount: faker.number.int(),
  },
  results: [usageSummary],
};

export default projectUsageSummary;
