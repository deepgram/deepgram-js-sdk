import chai from "chai";
import { Deepgram } from "../src";
import {
  mockRequestId,
  mockProjectId,
  mockApiDomain,
  mockApiKey,
  mockBillingRequestList,
  mockBillingBalance,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Billing tests", () => {
  let deepgram: Deepgram = new Deepgram(mockApiKey, mockApiDomain);

  before(() => {
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      throw new Error(
        `Not all nock interceptors were used: ${JSON.stringify(
          nock.pendingMocks()
        )}`
      );
    }

    nock.cleanAll();
  });

  after(() => {
    nock.restore();
  });

  it("List requests resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/balances`)
      .reply(200, mockBillingRequestList);

    deepgram.billing.listBalances(mockProjectId).then((response) => {
      response.should.deep.eq(mockBillingRequestList);
    });
  });

  it("Get request resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/balances/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    deepgram.billing
      .getBalance(mockProjectId, mockRequestId)
      .then((request) => {
        request.should.deep.eq(mockBillingBalance);
      });
  });

  it("Custom endpoint: List requests resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/balances`)
      .reply(200, mockBillingRequestList);

    deepgram.billing.listBalances(mockProjectId, "test").then((response) => {
      response.should.deep.eq(mockBillingRequestList);
    });
  });

  it("Custom endpoint: Get request resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/balances/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    deepgram.billing
      .getBalance(mockProjectId, mockRequestId, "test")
      .then((request) => {
        request.should.deep.eq(mockBillingBalance);
      });
  });
});
