import { GetProjectUsageFieldsResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const usageModel = {
  name: faker.lorem.word(),
  language: faker.lorem.word(),
  version: faker.lorem.word(),
  model_id: faker.string.uuid(),
};

const projectUsageFields: GetProjectUsageFieldsResponse = {
  tags: [faker.lorem.word()],
  models: [usageModel],
  processing_methods: [faker.lorem.word()],
  languages: [faker.lorem.word()],
  features: [faker.lorem.word()],
};

export default projectUsageFields;
