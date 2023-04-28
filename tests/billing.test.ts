import chai, { assert } from "chai";
import { Deepgram } from "../src";
import {
  mockProjectId,
  mockApiDomain,
  mockApiKey,
  mockInvalidCredentials,
  mockBillingRequestList,
  mockBillingBalance,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Billing tests", () => {
  let deepgram: Deepgram;

  beforeEach(() => {
    deepgram = new Deepgram(mockApiKey, mockApiDomain);
  });

  afterEach(() => {
    nock.restore();
  });

  it("Errors are thrown", () => {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/billing`)
      .reply(200, mockInvalidCredentials);

    deepgram.billing.listBalances(mockProjectId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("List requests resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}`)
      .reply(200, mockBillingRequestList);

    deepgram.billing.listBalances(mockProjectId).then((response) => {
      response.should.deep.eq(mockBillingRequestList);
    });
  });

  it("Get request resolves", () => {
    const mockRequestId = "1234-abcd";

    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/requests/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    deepgram.billing
      .getBalance(mockProjectId, mockRequestId)
      .then((request) => {
        request.should.deep.eq(mockBillingBalance);
      });
  });

  it("Custom endpoint: List requests resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}`)
      .reply(200, mockBillingRequestList);

    deepgram.billing.listBalances(mockProjectId, "test").then((response) => {
      response.should.deep.eq(mockBillingRequestList);
    });
  });

  it("Custom endpoint: Get request resolves", () => {
    const mockRequestId = "1234-abcd";

    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/requests/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    deepgram.billing
      .getBalance(mockProjectId, mockRequestId, "test")
      .then((request) => {
        request.should.deep.eq(mockBillingBalance);
      });
  });
});
