import chai, { assert } from "chai";
import Sinon from "sinon";
import { mockInvalidCredentials, mockScopesList } from "./mockResults";
import nock from "nock";
import https from "https";

import { Scopes } from "../src/scopes";

chai.should();

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";
const fakeProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";
const fakeMemberId = "member-id";

describe("Scope tests", () => {
  const sandbox = Sinon.createSandbox();

  let requestStub: Sinon.SinonStub;
  let scopes: Scopes;

  beforeEach(function () {
    requestStub = Sinon.stub(https, "request");
    scopes = new Scopes(fakeCredentials, fakeUrl, requestStub);
  });

  afterEach(function () {
    requestStub.restore();
    nock.restore();
    sandbox.restore();
  });

  it("Errors are thrown", function () {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/members/${fakeMemberId}/scopes`)
      .reply(200, mockInvalidCredentials);

    scopes.get(fakeProjectId, fakeMemberId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("Get resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/members/${fakeMemberId}/scopes`)
      .reply(200, mockScopesList);

    scopes.get(fakeProjectId, fakeMemberId).then((response) => {
      response.should.deep.eq(mockScopesList);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Update resolves", () => {
    const mockMessage = {
      message: "message"
    };

    nock(`https://${fakeUrl}`)
    .put(`/v1/projects/${fakeProjectId}/members/${fakeMemberId}/scopes`)
    .reply(200, mockMessage);

    scopes.update(fakeProjectId, fakeMemberId, "scope").then((response) => {
      response.should.deep.eq(mockMessage);
      requestStub.calledOnce.should.eq(true);
    })
  });
});