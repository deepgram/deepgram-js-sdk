import { faker } from "@faker-js/faker";
import { GetProjectResponse } from "../../src/lib/types";

const project: GetProjectResponse = {
  project_id: faker.string.uuid(),
  name: faker.lorem.words(3),
  company: faker.lorem.words(3),
};

export default project;
