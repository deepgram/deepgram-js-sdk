import { faker } from "@faker-js/faker";
import type { AsyncPrerecordedResponse } from "../../src/lib/types";

const asyncConfirmation: AsyncPrerecordedResponse = {
  request_id: faker.string.uuid(),
};

export default asyncConfirmation;
