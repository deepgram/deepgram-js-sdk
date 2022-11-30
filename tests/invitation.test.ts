import chai, { assert } from "chai";
import Sinon from "sinon";
import { mockInvalidCredentials, mockInvites } from "./mockResults";
import nock from "nock";
import https from "https";

import { Invitation } from "../src/invitation";

chai.should();

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";
const fakeProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

describe("Invitation tests", () => {
  const sandbox = Sinon.createSandbox();

  let requestStub: Sinon.SinonStub;
  let invitation: Invitation;

  beforeEach(() => {
    requestStub = Sinon.stub(https, "request");
    invitation = new Invitation(fakeCredentials, fakeUrl, true, requestStub);
  });

  afterEach(() => {
    requestStub.restore();
    nock.restore();
    sandbox.restore();
  });

  it("Errors are thrown", () => {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/invites`)
      .reply(200, mockInvalidCredentials);

    invitation.list(fakeProjectId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("List resolves", () => {
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/invites`)
      .reply(200, mockInvites);

    invitation.list(fakeProjectId).then((response) => {
      response.should.deep.eq(mockInvites);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Send resolves", () => {
    const resMessage = "Invite sent!";
    const inviteOptions = mockInvites.invites[0];

    nock(`https://${fakeUrl}`)
      .post(`/v1/projects/${fakeProjectId}/invites`)
      .reply(200, resMessage);

    invitation.send(fakeProjectId, inviteOptions).then((response) => {
      response.should.eq(resMessage);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Leave resolves", () => {
    const resMessage = "Account removed";

    nock(`https://${fakeUrl}`)
      .delete(`/v1/projects/${fakeProjectId}/leave`)
      .reply(200, resMessage);

    invitation.leave(fakeProjectId).then((response) => {
      response.should.eq(resMessage);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Delete resolves", () => {
    const resMessage = "Email removed";
    const mockEmail = "uninvited@hotmail.com";

    nock(`https;//${fakeUrl}`)
      .delete(`/v1/projects/${fakeProjectId}/invites/${mockEmail}`)
      .reply(200, resMessage);

    invitation.delete(fakeProjectId, mockEmail).then((response) => {
      response.should.eq(resMessage);
      requestStub.calledOnce.should.eq(true);
    });
  });
});
