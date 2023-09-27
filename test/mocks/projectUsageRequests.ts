import { GetProjectUsageRequestsResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";
import projectUsageRequest from "./projectUsageRequest";

const projectUsageRequests: GetProjectUsageRequestsResponse = {
  page: faker.number.int(),
  limit: faker.number.int(),
  requests: [projectUsageRequest],
};

export default projectUsageRequests;
