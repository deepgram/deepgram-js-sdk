import { faker } from "@faker-js/faker";
import { CreateProjectKeyResponse } from "../../src/lib/types";

const newProjectKey: CreateProjectKeyResponse = {
  api_key_id: faker.string.uuid(),
  key: faker.string.alphanumeric(40),
  comment: faker.lorem.paragraph(),
  scopes: [faker.lorem.words(1)],
  tags: [faker.lorem.words(1)],
  created: faker.date.anytime().toISOString(),
};

export default newProjectKey;
