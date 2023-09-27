import { GetProjectMemberScopesResponse } from "../../src/lib/types";
import { faker } from "@faker-js/faker";

const projectMemberScopes: GetProjectMemberScopesResponse = {
  scopes: [faker.lorem.word()],
};

export default projectMemberScopes;
