import { faker } from "@faker-js/faker";
import { MessageResponse } from "../../src/lib/types";

const message: MessageResponse = {
  message: faker.lorem.paragraph(),
};

export default message;
