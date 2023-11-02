import { createClient } from "../src";
import { DEFAULT_URL } from "../src/lib/constants";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { stripTrailingSlash } from "../src/lib/helpers";
import DeepgramClient from "../src/DeepgramClient";
import { ListenClient } from "../src/packages/ListenClient";

const deepgram = createClient(faker.string.alphanumeric(40));

describe("testing creation of a deepgram client object", () => {
  it("it should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("it should provide provide access to a transcription client", () => {
    expect(deepgram.listen).to.not.be.undefined;
    expect(deepgram.listen).is.instanceOf(ListenClient);
  });

  it("it should have the default URL when no custom URL option is provided", () => {
    // @ts-ignore
    const url = deepgram.baseUrl.hostname;

    expect(url).to.equal(DEFAULT_URL);
  });

  it("it should throw an error if no valid apiKey is provided", () => {
    expect(() => createClient("")).to.throw("A deepgram API key is required");
  });

  it("it should throw an error if invalid options are provided", () => {
    expect(() => createClient(faker.string.alphanumeric(40), { global: { url: "" } })).to.throw(
      `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
    );
  });

  it("it should create the client object with a custom domain", () => {
    const domain = faker.internet.url({ appendSlash: false });
    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: domain },
    });

    // @ts-ignore
    const baseUrl = client.baseUrl;

    expect(client).is.instanceOf(DeepgramClient);
    expect(`${baseUrl.protocol}//${baseUrl.hostname}`).to.equal(domain);
  });

  it("it should strip trailing slashes off the API URL if they're supplied", () => {
    const domain = faker.internet.url({ appendSlash: true });
    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: domain },
    });

    // @ts-ignore
    const baseUrl = client.baseUrl;

    expect(client).is.instanceOf(DeepgramClient);
    expect(`${baseUrl.protocol}//${baseUrl.hostname}`).to.equal(stripTrailingSlash(domain));
  });

  it("it should still work when provided a URL without a protocol", () => {
    const domain = `api.mock.deepgram.com`;
    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: domain },
    });

    // @ts-ignore
    const url = client.baseUrl.hostname;

    expect(client).is.instanceOf(DeepgramClient);
    expect(url).to.equal("api.mock.deepgram.com");
  });

  it("it should allow for the supply of a custom header", () => {
    const client = createClient(faker.string.alphanumeric(40), {
      global: { headers: { "X-dg-test": "testing" } },
    });

    expect(client).is.instanceOf(DeepgramClient);
  });
});
