import { GetProjectMembersResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const projectMembers: GetProjectMembersResponse = {
  members: [
    {
      member_id: faker.string.uuid(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      scopes: [faker.lorem.words(1)],
    },
  ],
};

export default projectMembers;
