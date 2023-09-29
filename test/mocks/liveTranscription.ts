import { faker } from "@faker-js/faker";
import { LiveTranscriptionResponse } from "../../src/lib/types";

const liveTranscription: LiveTranscriptionResponse = {
  type: "Results",
  channel_index: [faker.number.int()],
  duration: faker.number.float(),
  start: faker.number.float(),
  is_final: faker.datatype.boolean(),
  speech_final: faker.datatype.boolean(),
  channel: {
    alternatives: [
      {
        transcript: faker.lorem.words(10),
        confidence: faker.datatype.boolean(),
        words: [
          {
            word: faker.lorem.word(),
            start: faker.number.float(),
            end: faker.number.float(),
            confidence: faker.number.float(),
            punctuated_word: faker.lorem.word(),
          },
        ],
      },
    ],
  },
  metadata: {
    request_id: faker.string.uuid(),
    model_info: { name: faker.lorem.word(), version: faker.lorem.word(), arch: faker.lorem.word() },
    model_uuid: faker.string.uuid(),
  },
};

export default liveTranscription;
