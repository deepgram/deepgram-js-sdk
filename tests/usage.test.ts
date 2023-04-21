import chai, { assert } from "chai";
import Sinon from "sinon";
import {
  mockInvalidCredentials,
  mockUsageField,
  mockUsageRequestList,
  mockUsageRequest,
  mockUsageResponse,
} from "./mockResults";
import nock from "nock";
import https from "https";

import { Usage } from "../src/usage";

chai.should();

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";
const fakeProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

describe("Usage tests", () => {
  const sandbox = Sinon.createSandbox();

  let requestStub: Sinon.SinonStub;
  let usage: Usage;

  beforeEach(() => {
    requestStub = Sinon.stub(https, "request");
    usage = new Usage(fakeCredentials, fakeUrl, true, requestStub);
  });

  afterEach(() => {
    requestStub.restore();
    nock.restore();
    sandbox.restore();
  });

  it("Errors are thrown", () => {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/requests?`)
      .reply(200, mockInvalidCredentials);

    usage.listRequests(fakeProjectId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("List requests resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}`)
      .reply(200, mockUsageRequestList);

    usage.listRequests(fakeProjectId).then((response) => {
      response.should.deep.eq(mockUsageRequestList);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Get request resolves", () => {
    const mockRequestId = "1234-abcd";

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/requests/${mockRequestId}`)
      .reply(200, mockUsageRequest);

    usage.getRequest(fakeProjectId, mockRequestId).then((request) => {
      request.should.deep.eq(mockUsageRequest);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Get usage resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/usage?`)
      .reply(200, mockUsageResponse);

    usage.getUsage(fakeProjectId).then((response) => {
      response.should.deep.eq(mockUsageResponse);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Get fields resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/usage/fields?`)
      .reply(200, mockUsageField);

    usage.getFields(fakeProjectId).then((response) => {
      response.should.deep.eq(mockUsageField);
      requestStub.calledOnce.should.eq(true);
    });
  });
});
