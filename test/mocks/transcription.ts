import { faker } from "@faker-js/faker";
import type { SyncPrerecordedResponse } from "../../src/lib/types/SyncPrerecordedResponse";

const transcription: SyncPrerecordedResponse = {
  metadata: {
    transaction_key: faker.string.alpha(20),
    request_id: faker.string.uuid(),
    sha256: faker.string.alphanumeric(40),
    created: faker.date.anytime().toISOString(),
    duration: faker.number.float(),
    channels: faker.number.int(1),
    models: [faker.string.uuid()],
    model_info: {
      [faker.string.uuid()]: {
        name: faker.string.alpha(10),
        version: faker.string.alpha(10),
        arch: faker.string.alpha(10),
      },
    },
  },
  results: {
    channels: [
      {
        search: [
          {
            query: faker.string.alpha(10),
            hits: [
              {
                confidence: faker.number.float(),
                start: faker.number.float(),
                end: faker.number.float(),
                snippet: faker.string.alpha(10),
              },
            ],
          },
        ],
        alternatives: [
          {
            transcript: faker.lorem.paragraph(),
            confidence: faker.number.float(),
            words: [
              {
                word: faker.string.alpha(),
                start: faker.number.float(),
                end: faker.number.float(),
                confidence: faker.number.float(),
                punctuated_word: faker.string.alpha(),
              },
            ],
            paragraphs: {
              transcript: faker.lorem.paragraph(),
              paragraphs: [
                {
                  sentences: [
                    {
                      text: faker.lorem.sentence(),
                      start: faker.number.float(),
                      end: faker.number.float(),
                    },
                  ],
                  num_words: faker.number.int(1),
                  start: faker.number.float(),
                  end: faker.number.float(),
                },
              ],
            },
            entities: [
              {
                label: faker.string.alpha(),
                value: faker.string.alpha(),
                confidence: faker.number.float(),
                start_word: faker.number.float(),
                end_word: faker.number.float(),
              },
            ],
            summaries: [
              {
                summary: faker.lorem.paragraph(),
                start_word: faker.number.int(1),
                end_word: faker.number.int(1),
              },
            ],
            topics: [
              {
                text: faker.lorem.paragraph(),
                start_word: faker.number.int(1),
                end_word: faker.number.int(1),
                topics: [
                  {
                    topic: faker.string.alpha(10),
                    confidence: faker.number.float(),
                  },
                ],
              },
            ],
          },
        ],
        detected_language: faker.string.alpha(2),
      },
    ],
    utterances: [
      {
        start: faker.number.float(),
        end: faker.number.float(),
        confidence: faker.number.float(),
        channel: faker.number.int(1),
        transcript: faker.lorem.sentence(),
        words: [
          {
            word: faker.string.alpha(10),
            start: faker.number.float(),
            end: faker.number.float(),
            confidence: faker.number.float(),
            speaker: faker.number.int(1),
            speaker_confidence: faker.number.float(),
            punctuated_word: faker.string.alpha(10),
          },
        ],
        speaker: faker.number.int(1),
        id: faker.string.uuid(),
      },
    ],
    summary: {
      short: faker.lorem.sentence(),
      result: faker.string.alpha(10),
    },
  },
};

export default transcription;
