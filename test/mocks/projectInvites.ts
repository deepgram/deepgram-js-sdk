import { GetProjectInvitesResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const projectInvites: GetProjectInvitesResponse = {
  invites: [
    {
      email: faker.internet.email(),
      scope: faker.lorem.word(),
    },
  ],
};

export default projectInvites;
