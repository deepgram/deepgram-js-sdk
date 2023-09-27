import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

describe("making onprem requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "http://localhost:8080" },
    });
  });

  it("should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("should list onprem credentials", async () => {
    const { result, error } = await deepgram.onprem.listCredentials(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["distribution_credentials"]);
  });

  it("should get onprem credentials", async () => {
    const { result, error } = await deepgram.onprem.getCredentials(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["member"]);
  });

  it("should create onprem credentials", async () => {
    const { result, error } = await deepgram.onprem.createCredentials(faker.string.uuid(), {
      comment: faker.lorem.paragraph(),
      scopes: [faker.lorem.word()],
      provider: faker.lorem.word(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["member"]);
  });

  it("should delete onprem credentials", async () => {
    const { result, error } = await deepgram.onprem.deleteCredentials(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });
});
