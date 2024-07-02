import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

describe("making self-hosted REST requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  it("should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("should list selfhosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.listCredentials(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["distribution_credentials"]);
  });

  it("should get selfhosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.getCredentials(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["member"]);
  });

  it("should create selfhosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.createCredentials(faker.string.uuid(), {
      comment: faker.lorem.paragraph(),
      scopes: [faker.lorem.word()],
      provider: faker.lorem.word(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["member"]);
  });

  it("should delete selfhosted credentials", async () => {
    const { result, error } = await deepgram.selfhosted.deleteCredentials(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });
});
