import { expect } from "chai";
import { createClient } from "../src";
import DeepgramClient from "../src/DeepgramClient";
import { faker } from "@faker-js/faker";
import { DEFAULT_URL } from "../src/lib/constants";
import { stripTrailingSlash } from "../src/lib/helpers";

const deepgram = createClient(faker.string.alphanumeric(40));

it("it should create the client object", () => {
  expect(deepgram).to.not.be.undefined;
  expect(deepgram).is.instanceOf(DeepgramClient);
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
  const customDomain = faker.internet.url();
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
