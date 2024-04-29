import { createClient } from "../src";
import { DEFAULT_URL } from "../src/lib/constants";
import { expect, assert } from "chai";
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
    const url = deepgram.namespaceOptions.fetch.options.url;

    expect(url).to.equal(DEFAULT_URL);
  });

  it("it should throw an error if no valid apiKey is provided", () => {
    expect(() => createClient("")).to.throw("A deepgram API key is required");
  });

  it("it should throw an error if invalid options are provided", () => {
    // const client = createClient({ global: { fetch: { options: { url: "" } } } });
    // console.log(client);
    // process.exit(1);
    expect(() => createClient({ global: { fetch: { options: { url: "" } } } })).to.throw(
      `A deepgram API key is required.`
    );
  });

  it("it should create the client object with legacy options", () => {
    const mockUrl = faker.internet.url({ appendSlash: false });
    const mockKey = faker.string.alphanumeric(40);
    const client = createClient(mockKey, {
      global: { url: mockUrl },
    });

    // @ts-ignore
    const url = client.namespaceOptions.fetch.options.url;

    // @ts-ignore
    const key = client.options.key;

    expect(client).is.instanceOf(DeepgramClient);
    expect(url).to.equal(mockUrl);
    expect(key).to.equal(mockKey);
  });

  it("it should create the client object with a custom url", () => {
    const mockUrl = faker.internet.url({ appendSlash: false });
    const mockKey = faker.string.alphanumeric(40);
    const client = createClient({
      key: mockKey,
      global: { fetch: { options: { url: mockUrl } } },
    });

    // @ts-ignore
    const url = client.namespaceOptions.fetch.options.url;

    // @ts-ignore
    const key = client.options.key;

    expect(client).is.instanceOf(DeepgramClient);
    expect(url).to.equal(mockUrl);
    expect(key).to.equal(mockKey);
  });

  it("it should strip trailing slashes off the API URL if they're supplied", () => {
    const mockUrl = faker.internet.url({ appendSlash: false });
    const mockKey = faker.string.alphanumeric(40);
    const client = createClient({
      key: mockKey,
      global: { fetch: { options: { url: `${mockUrl}/` } } },
    });

    // @ts-ignore
    const url = client.namespaceOptions.fetch.options.url;

    // @ts-ignore
    const key = client.options.key;

    expect(client).is.instanceOf(DeepgramClient);
    expect(url).to.equal(mockUrl);
    expect(key).to.equal(mockKey);
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

  it("should use custom fetch when provided", async () => {
    const fetch = async () => {
      return new Response(JSON.stringify({ customFetch: true }));
    };

    const client = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
      _experimentalCustomFetch: fetch,
    });

    const { result, error } = await client.manage.getProjectBalances(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["customFetch"]);
  });
});
