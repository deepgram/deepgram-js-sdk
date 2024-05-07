import { expect } from "chai";
import sinon from "sinon";
import { AbstractRestClient } from "../src/packages/AbstractRestClient";
import { DeepgramClientOptions } from "../src/lib/types";
import { DeepgramError, DeepgramApiError, DeepgramUnknownError } from "../src/lib/errors";
import * as helpers from "../src/lib/helpers";

class TestRestClient extends AbstractRestClient {
  constructor(options: DeepgramClientOptions) {
    super(options);
  }
}

describe("AbstractRestClient", () => {
  let restClient: TestRestClient;
  const options: DeepgramClientOptions = {
    key: "test-key",
    global: {
      fetch: {
        options: {
          url: "https://api.mock.deepgram.com",
        },
      },
    },
  };

  beforeEach(() => {
    restClient = new TestRestClient(options);
  });

  it("should throw an error when running in the browser without a proxy", () => {
    const isBrowserStub = sinon.stub(helpers, "isBrowser");
    isBrowserStub.returns(true);
    expect(() => new TestRestClient(options)).to.throw(DeepgramError);
    isBrowserStub.restore();
  });

  it("should set the baseUrl correctly with a proxy", () => {
    const options: DeepgramClientOptions = {
      key: "proxy",
      global: {
        fetch: {
          options: {
            url: "https://api.mock.deepgram.com",
            proxy: {
              url: "https://proxy.mock.deepgram.com",
            },
          },
        },
      },
    };

    const restClient = new TestRestClient(options);
    expect(restClient.baseUrl).to.equal("https://proxy.mock.deepgram.com");
  });

  it("should set the baseUrl correctly without a proxy", () => {
    expect(restClient.baseUrl).to.equal("https://api.mock.deepgram.com");
  });

  it("should handle API errors correctly", async () => {
    const mockResponse = new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
    });
    const fetchStub = sinon.stub().rejects(mockResponse);
    // @ts-expect-error
    const handleErrorSpy = sinon.spy(restClient, "_handleError");

    try {
      // @ts-expect-error
      await restClient._handleRequest(fetchStub, "GET", "https://api.mock.deepgram.com");
    } catch (error: any) {
      expect(handleErrorSpy.calledOnce).to.be.true;
      expect(error).to.be.an.instanceOf(DeepgramApiError);
      expect(error.message).to.equal("Bad Request");
      expect(error.status).to.equal(400);
    }
  });

  it("should handle unknown errors correctly", async () => {
    const mockError = new Error("Unknown error");
    const fetchStub = sinon.stub().rejects(mockError);
    // @ts-expect-error
    const handleErrorSpy = sinon.spy(restClient, "_handleError");

    try {
      // @ts-expect-error
      await restClient._handleRequest(fetchStub, "GET", "https://api.mock.deepgram.com");
    } catch (error: any) {
      expect(handleErrorSpy.calledOnce).to.be.true;
      expect(error).to.be.an.instanceOf(DeepgramUnknownError);
      expect(error.message).to.equal("Unknown error");
    }
  });

  it("should get request parameters correctly", () => {
    const headers = { "Content-Type": "application/json", Authorization: "Token test-key" };
    // @ts-expect-error
    const parameters: FetchParameters = { cache: "no-cache" };
    const body = JSON.stringify({ data: "test" });

    // @ts-expect-error
    const getParams = restClient._getRequestParams("GET", headers, parameters);
    expect(getParams).to.deep.equal({
      method: "GET",
      headers: {
        Authorization: "Token test-key",
        "Content-Type": "application/json",
      },
    });

    // @ts-expect-error
    const postParams = restClient._getRequestParams("POST", headers, parameters, body);
    expect(postParams).to.deep.equal({
      method: "POST",
      headers: {
        Authorization: "Token test-key",
        "Content-Type": "application/json",
      },
      body: body,
      duplex: "half",
      cache: "no-cache",
    });
  });

  it("should handle successful requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);

    // @ts-expect-error
    const result = await restClient._handleRequest(
      fetchStub,
      "GET",
      "https://api.mock.deepgram.com"
    );
    expect(result).to.deep.equal({ data: "test" });
  });

  it("should handle raw requests correctly", async () => {
    const mockResponse = { ok: true, text: () => Promise.resolve("test data") };
    const fetchStub = sinon.stub().resolves(mockResponse);

    // @ts-expect-error
    const result = await restClient._handleRawRequest(
      fetchStub,
      "GET",
      "https://api.mock.deepgram.com"
    );
    expect(result).to.deep.equal(mockResponse);
  });

  it("should make GET requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);

    // @ts-expect-error
    const result = await restClient.get(fetchStub, "https://api.mock.deepgram.com");
    expect(result).to.deep.equal({ data: "test" });
  });

  it("should make POST requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);
    const body = JSON.stringify({ data: "test" });

    // @ts-expect-error
    const result = await restClient.post(fetchStub, "https://api.mock.deepgram.com", body);
    expect(result).to.deep.equal({ data: "test" });
  });

  it("should make PUT requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);
    const body = JSON.stringify({ data: "test" });

    // @ts-expect-error
    const result = await restClient.put(fetchStub, "https://api.mock.deepgram.com", body);
    expect(result).to.deep.equal({ data: "test" });
  });

  it("should make PATCH requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);
    const body = JSON.stringify({ data: "test" });

    // @ts-expect-error
    const result = await restClient.patch(fetchStub, "https://api.mock.deepgram.com", body);
    expect(result).to.deep.equal({ data: "test" });
  });

  it("should make DELETE requests correctly", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    };
    const fetchStub = sinon.stub().resolves(mockResponse);

    // @ts-expect-error
    const result = await restClient.delete(fetchStub, "https://api.mock.deepgram.com");
    expect(result).to.deep.equal({ data: "test" });
  });
});
