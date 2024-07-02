import { applyDefaults, convertProtocolToWs, isBrowser } from "../src/lib/helpers";
import {
  CONNECTION_STATE,
  DEFAULT_GLOBAL_OPTIONS,
  DEFAULT_HEADERS,
  DEFAULT_OPTIONS,
  DEFAULT_URL,
  NODE_VERSION,
  SOCKET_STATES,
} from "../src/lib/constants";
import { DeepgramClientOptions } from "../src/lib/types/DeepgramClientOptions";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { version } from "../src/lib/version";

describe("DEFAULT_OPTIONS", () => {
  it("DEFAULT_OPTIONS are valid options", () => {
    const options: DeepgramClientOptions = DEFAULT_OPTIONS;

    expect(options).to.not.be.undefined;
  });

  it("DEFAULT_OPTIONS can be overridden", () => {
    const options = {
      global: { url: faker.internet.url({ appendSlash: false }) },
    };
    const settings = applyDefaults(options, DEFAULT_OPTIONS);

    expect(settings).is.not.deep.equal(options);
  });
});

describe("DEFAULT_HEADERS", () => {
  it("should have the correct Content-Type header", () => {
    expect(DEFAULT_HEADERS["Content-Type"]).to.equal("application/json");
  });

  it("should have the correct X-Client-Info header", () => {
    const expectedHeader = `@deepgram/sdk; ${isBrowser() ? "browser" : "server"}; v${version}`;
    expect(DEFAULT_HEADERS["X-Client-Info"]).to.equal(expectedHeader);
  });

  it("should have the correct User-Agent header", () => {
    const expectedHeader = `@deepgram/sdk/${version} ${
      isBrowser() ? "javascript" : `node/${NODE_VERSION}`
    }`;
    expect(DEFAULT_HEADERS["User-Agent"]).to.equal(expectedHeader);
  });
});

describe("DEFAULT_URL", () => {
  it("should be a valid URL", () => {
    expect(DEFAULT_URL).to.match(/^https?:\/\//);
  });
});

describe("DEFAULT_GLOBAL_OPTIONS", () => {
  it("should have the correct fetch options", () => {
    expect(DEFAULT_GLOBAL_OPTIONS.fetch?.options).to.deep.equal({
      url: DEFAULT_URL,
      headers: DEFAULT_HEADERS,
    });
  });

  it("should have the correct websocket options", () => {
    expect(DEFAULT_GLOBAL_OPTIONS.websocket?.options).to.deep.equal({
      url: convertProtocolToWs(DEFAULT_URL),
      _nodeOnlyHeaders: DEFAULT_HEADERS,
    });
  });
});

describe("DEFAULT_OPTIONS", () => {
  it("should have the correct global options", () => {
    expect(DEFAULT_OPTIONS.global).to.deep.equal(DEFAULT_GLOBAL_OPTIONS);
  });
});

describe("SOCKET_STATES", () => {
  it("should have the correct values", () => {
    expect(SOCKET_STATES.connecting).to.equal(0);
    expect(SOCKET_STATES.open).to.equal(1);
    expect(SOCKET_STATES.closing).to.equal(2);
    expect(SOCKET_STATES.closed).to.equal(3);
  });
});

describe("CONNECTION_STATE", () => {
  it("should have the correct values", () => {
    expect(CONNECTION_STATE.Connecting).to.equal("connecting");
    expect(CONNECTION_STATE.Open).to.equal("open");
    expect(CONNECTION_STATE.Closing).to.equal("closing");
    expect(CONNECTION_STATE.Closed).to.equal("closed");
  });
});
