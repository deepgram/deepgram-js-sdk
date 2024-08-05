import { assert } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

describe("making models REST requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  it("should retrieve a list of models", async () => {
    const { result, error } = await deepgram.models.getAll();

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["stt", "tts"]);
  });

  it("should retrieve a model", async () => {
    const { result, error } = await deepgram.models.getModel(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["name", "canonical_name"]);
  });
});
