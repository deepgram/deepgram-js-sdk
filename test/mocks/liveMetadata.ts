import { faker } from "@faker-js/faker";
import { LiveMetadataResponse } from "../../src/lib/types";

const liveMetadata: LiveMetadataResponse = {
  type: "Metadata",
  transaction_key: faker.string.alpha(20),
  request_id: faker.string.uuid(),
  sha256: faker.string.alphanumeric(40),
  created: faker.date.anytime().toISOString(),
  duration: faker.number.float(),
  channels: faker.number.int(1),
};

export default liveMetadata;
