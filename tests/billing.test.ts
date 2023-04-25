import chai, { assert } from "chai";
import Sinon from "sinon";
import {
  mockInvalidCredentials,
  mockBillingRequestList,
  mockBillingBalance,
} from "./mockResults";
import nock from "nock";
import https from "https";

import { Billing } from "../src/billing";

chai.should();

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";
const fakeProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

describe("Billing tests", () => {
  const sandbox = Sinon.createSandbox();

  let requestStub: Sinon.SinonStub;
  let billing: Billing;

  beforeEach(() => {
    requestStub = Sinon.stub(https, "request");
    billing = new Billing(fakeCredentials, fakeUrl, true, requestStub);
  });

  afterEach(() => {
    requestStub.restore();
    nock.restore();
    sandbox.restore();
  });

  it("Errors are thrown", () => {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/billing`)
      .reply(200, mockInvalidCredentials);

    billing.listBalances(fakeProjectId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("List requests resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}`)
      .reply(200, mockBillingRequestList);

    billing.listBalances(fakeProjectId).then((response) => {
      response.should.deep.eq(mockBillingRequestList);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Get request resolves", () => {
    const mockRequestId = "1234-abcd";

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/requests/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    billing.getBalance(fakeProjectId, mockRequestId).then((request) => {
      request.should.deep.eq(mockBillingBalance);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Custom endpoint: List requests resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/test/${fakeProjectId}`)
      .reply(200, mockBillingRequestList);

    billing.listBalances(fakeProjectId, "test").then((response) => {
      response.should.deep.eq(mockBillingRequestList);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Custom endpoint: Get request resolves", () => {
    const mockRequestId = "1234-abcd";

    nock(`https://${fakeUrl}`)
      .get(`/test/${fakeProjectId}/requests/${mockRequestId}`)
      .reply(200, mockBillingBalance);

    billing.getBalance(fakeProjectId, mockRequestId, "test").then((request) => {
      request.should.deep.eq(mockBillingBalance);
      requestStub.calledOnce.should.eq(true);
    });
  });
});
