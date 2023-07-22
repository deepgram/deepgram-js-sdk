import { createClient } from "../src";
import { DEFAULT_URL } from "../src/lib/constants";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { stripTrailingSlash } from "../src/lib/helpers";
import DeepgramClient from "../src/DeepgramClient";
import { TranscriptionClient } from "../src/packages/TranscriptionClient";

const deepgram = createClient(faker.string.alphanumeric(40));

describe("testing creation of a deepgram client object", () => {
  it("it should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("it should provide provide access to a transcription client", () => {
    expect(deepgram.transcription).to.not.be.undefined;
    expect(deepgram.transcription).is.instanceOf(TranscriptionClient);
  });

  it("it should have the default URL when no custom URL option is provided", () => {
    // @ts-ignore
    const apiUrl = deepgram.apiUrl;

    expect(apiUrl).to.equal(DEFAULT_URL);
  });

  it("it should throw an error if no valid apiKey is provided", () => {
    expect(() => createClient("")).to.throw("deepgramKey is required");
  });

  it("it should throw an error if invalid options are provided", () => {
    expect(() => createClient(faker.string.alphanumeric(40), { global: { url: "" } })).to.throw(
      `An API URL is required. It should be set to ${DEFAULT_URL} by default. No idea what happened!`
    );
  });

  it("it should create the client object with a custom domain", () => {
    const customDomain = faker.internet.url({ appendSlash: false });
    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: customDomain },
    });

    // @ts-ignore
    const apiUrl = client.apiUrl;

    expect(client).is.instanceOf(DeepgramClient);
    expect(apiUrl).to.equal(customDomain);
  });

  it("it should strip trailing slashes off the API URL if they're supplied", () => {
    const customDomain = faker.internet.url({ appendSlash: true });
    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: customDomain },
    });

    // @ts-ignore
    const apiUrl = client.apiUrl;

    // @ts-ignore
    const wsUrl = client.wsUrl;

    expect(client).is.instanceOf(DeepgramClient);
    expect(apiUrl).to.equal(stripTrailingSlash(customDomain));
    expect(wsUrl).to.equal(stripTrailingSlash(customDomain).replace(/^http/i, "ws"));
  });

  it("it should allow for the supply of a custom fetch", () => {
    const client = createClient(faker.string.alphanumeric(40), {
      global: { fetch: (...args) => fetch(...args) },
    });

    expect(client).is.instanceOf(DeepgramClient);
  });

  it("it should allow for the supply of a custom header", () => {
    const client = createClient(faker.string.alphanumeric(40), {
      global: { headers: { "X-dg-test": "testing" } },
    });

    expect(client).is.instanceOf(DeepgramClient);
  });
});
