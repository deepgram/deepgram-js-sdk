import { expect } from "chai";
import { createClient, DeepgramClient, Deepgram } from "../src";

describe("createClient", () => {
  it("should create a DeepgramClient instance with a key", () => {
    const key = "test_key";
    const client = createClient(key);
    expect(client).to.be.an.instanceOf(DeepgramClient);
    // @ts-expect-error
    expect(client.options.key).to.equal(key);
  });

  it("should create a DeepgramClient instance with options", () => {
    const options = {
      key: "test_key",
      global: { fetch: { options: { url: "https://example.com" } } },
    };
    const client = createClient(options);
    expect(client).to.be.an.instanceOf(DeepgramClient);
    // @ts-expect-error
    expect(client.options.key).to.equal(options.key);
    expect(client.namespaceOptions.fetch.options.url).to.equal(options.global.fetch.options.url);
  });

  it("should create a DeepgramClient instance with a key and options", () => {
    const key = "test_key";
    const options = {
      global: { fetch: { options: { url: "https://example.com" } } },
    };
    const client = createClient(key, options);
    expect(client).to.be.an.instanceOf(DeepgramClient);
    // @ts-expect-error
    expect(client.options.key).to.equal(key);
    expect(client.namespaceOptions.fetch.options.url).to.equal(options.global.fetch.options.url);
  });
});
