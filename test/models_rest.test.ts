import { assert } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import { ModelsRestClient } from "../src/packages";

describe("ModelsRestClient", () => {
  let modelsRestClient: ModelsRestClient;

  beforeEach(() => {
    modelsRestClient = createClient(faker.string.alphanumeric(40)).models;
  });

  it("should retrieve a list of models", async () => {
    const { result, error } = await modelsRestClient.getAll();

    assert.isNull(error);
    assert.isNotNull(result);
  });

  it("should retrieve a models", async () => {
    const { result, error } = await modelsRestClient.getModel(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
  });
});
