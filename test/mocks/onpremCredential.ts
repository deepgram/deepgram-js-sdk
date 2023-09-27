import { faker } from "@faker-js/faker";
import { OnPremCredentialResponse } from "../../src/lib/types";

const onpremCredential: OnPremCredentialResponse = {
  member: {
    member_id: faker.string.uuid(),
    email: faker.internet.email(),
  },
  distribution_credentials: {
    distribution_credentials_id: faker.string.uuid(),
    provider: faker.lorem.word(),
    comment: faker.lorem.word(),
    scopes: [faker.lorem.word()],
    created: faker.lorem.word(),
  },
};

export default onpremCredential;
