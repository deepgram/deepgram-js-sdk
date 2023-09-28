import { faker } from "@faker-js/faker";
import { CreateOnPremCredentialsOptions } from "../../src/lib/types";

const newOnpremCredential: CreateOnPremCredentialsOptions = {
  member: {
    member_id: faker.string.uuid(),
    email: faker.internet.email(),
  },
  distribution_credentials: {
    distribution_credentials_id: faker.string.uuid(),
    provider: faker.lorem.word(),
    secret: faker.string.alphanumeric(40),
    comment: faker.lorem.word(),
    scopes: [faker.lorem.word()],
    created: faker.date.anytime().toISOString(),
  },
};

export default newOnpremCredential;
