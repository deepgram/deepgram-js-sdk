import { faker } from "@faker-js/faker";
import { GetProjectKeyResponse } from "../../src/lib/types";

const member = {
  member_id: faker.string.uuid(),
  email: faker.internet.email(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
};

const api_key = {
  api_key_id: faker.string.uuid(),
  comment: faker.lorem.paragraph(),
  scopes: [faker.lorem.words(1)],
  tags: [faker.lorem.words(1)],
  created: faker.date.anytime().toISOString(),
};

const projectKey: GetProjectKeyResponse = {
  member,
  api_key,
};

export default projectKey;
