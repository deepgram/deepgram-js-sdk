import { faker } from "@faker-js/faker";
import { LiveMetadataEvent } from "../../src/lib/types";

const liveMetadata: LiveMetadataEvent = {
  type: "Metadata",
  transaction_key: faker.string.alpha(20),
  request_id: faker.string.uuid(),
  sha256: faker.string.alphanumeric(40),
  created: faker.date.anytime().toISOString(),
  duration: faker.number.float(),
  channels: faker.number.int(1),
};

export default liveMetadata;
