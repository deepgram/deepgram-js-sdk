import { AbstractClient } from "../src/packages/AbstractClient";
import { expect } from "chai";
import merge from "deepmerge";
import sinon from "sinon";
import type { DeepgramClientOptions, DefaultNamespaceOptions } from "../src/lib/types";

import { DEFAULT_OPTIONS, DEFAULT_URL } from "../src/lib/constants";

class TestClient extends AbstractClient {
  constructor(options: DeepgramClientOptions) {
    super(options);
  }
}

describe("AbstractClient", () => {
  let client: AbstractClient;
  const options: DeepgramClientOptions = {
    key: "test-key",
    global: {
      fetch: { options: { url: "https://api.mock.deepgram.com" } },
      websocket: { options: { url: "wss://api.mock.deepgram.com" } },
    },
  };

  beforeEach(() => {
    client = new TestClient(options);
  });

  it("should create an instance of AbstractClient", () => {
    expect(client).to.be.an.instanceOf(AbstractClient);
  });

  it("should set the key property correctly", () => {
    // @ts-expect-error
    expect(client.key).to.equal("test-key");
  });

  it("should set the options property correctly", () => {
    const expectedOptions = merge(DEFAULT_OPTIONS, options);

    // @ts-expect-error
    expect(expectedOptions).to.deep.equal(client.options);
  });

  it("should set the namespace property correctly", () => {
    expect(client.namespace).to.equal("global");
  });

  it("should set the version property correctly", () => {
    expect(client.version).to.equal("v1");
  });

  it("should set the baseUrl property correctly", () => {
    expect(client.baseUrl).to.equal(DEFAULT_URL);
  });

  it("should set the logger property correctly", () => {
    expect(client.logger).to.be.a("function");
  });

  it("should set the namespaceOptions property correctly", () => {
    const expectedOptions = merge(DEFAULT_OPTIONS.global, { ...options.global, key: "test-key" });

    expect(expectedOptions).to.deep.equal(client.namespaceOptions);
  });

  it("should generate a request URL correctly", () => {
    const endpoint = "/:version/transcription";
    const transcriptionOptions = { punctuate: true };
    const expectedUrl = new URL("https://api.deepgram.com/v2/transcription?punctuate=true");
    const actualUrl = client.v("v2").getRequestUrl(endpoint, {}, transcriptionOptions);
    expect(actualUrl.toString()).to.equal(expectedUrl.toString());
  });

  it("should log a message correctly", () => {
    const loggerSpy = sinon.spy(client, "logger");
    const kind = "info";
    const msg = "Test message";
    const data = { foo: "bar" };
    client.log(kind, msg, data);
    expect(loggerSpy.calledWith(kind, msg, data)).to.be.true;
  });
});
