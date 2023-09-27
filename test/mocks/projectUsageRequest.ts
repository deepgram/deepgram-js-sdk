import { GetProjectUsageRequestResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const projectUsageRequest: GetProjectUsageRequestResponse = {
  request_id: faker.string.uuid(),
  created: faker.date.anytime().toISOString(),
  path: faker.lorem.word(),
  api_key_id: faker.string.uuid(),
  response: {
    details: {
      usd: faker.number.int(),
      duration: faker.number.int(),
      total_audio: faker.number.int(),
      channels: faker.number.int(),
      streams: faker.number.int(),
      models: [faker.lorem.word()],
      method: faker.lorem.word(),
      tags: [faker.lorem.word()],
      features: [faker.lorem.word()],
      config: {
        alternatives: faker.number.int(),
        callback: faker.lorem.word(),
        diarize: faker.datatype.boolean(),
        keywords: [faker.lorem.word()],
        language: faker.lorem.word(),
        model: faker.lorem.word(),
        multichannel: faker.datatype.boolean(),
        ner: faker.datatype.boolean(),
        numerals: faker.datatype.boolean(),
        profanity_filter: faker.datatype.boolean(),
        punctuate: faker.datatype.boolean(),
        redact: [faker.lorem.word()],
        search: [faker.lorem.word()],
        utterances: faker.datatype.boolean(),
      },
    },
    code: faker.number.int(),
    completed: faker.lorem.word(),
  },
  callback: {
    attempts: faker.number.int(),
    code: faker.number.int(),
    completed: faker.lorem.word(),
  },
};

export default projectUsageRequest;
