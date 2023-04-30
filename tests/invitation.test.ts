import chai, { assert } from "chai";
import { Deepgram } from "../src";
import {
  mockEmail,
  mockScope,
  mockMessageResponse,
  mockProjectId,
  mockApiDomain,
  mockApiKey,
  mockInvalidCredentials,
  mockInvites,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Invitation tests", () => {
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

  it("List resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/invites`)
      .reply(200, mockInvites);

    deepgram.invitation.list(mockProjectId).then((response) => {
      response.should.deep.eq(mockInvites);
    });
  });

  it("Send resolves", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/v1/projects/${mockProjectId}/invites`)
      .reply(200, mockMessageResponse);

    deepgram.invitation
      .send(mockProjectId, { email: mockEmail, scope: mockScope })
      .then((response) => {
        response.should.eq(mockMessageResponse);
      });
  });

  it("Leave resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/v1/projects/${mockProjectId}/leave`)
      .reply(200, mockMessageResponse);

    deepgram.invitation.leave(mockProjectId).then((response) => {
      response.should.eq(mockMessageResponse);
    });
  });

  it("Delete resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/v1/projects/${mockProjectId}/invites/${mockEmail}`)
      .reply(200, mockMessageResponse);

    deepgram.invitation.delete(mockProjectId, mockEmail).then((response) => {
      response.should.eq(mockMessageResponse);
    });
  });

  it("Custom endpoint: List resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/invites`)
      .reply(200, mockInvites);

    deepgram.invitation.list(mockProjectId, "test").then((response) => {
      response.should.deep.eq(mockInvites);
    });
  });

  it("Custom endpoint: Send resolves", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/test/${mockProjectId}/invites`)
      .reply(200, mockMessageResponse);

    deepgram.invitation
      .send(mockProjectId, { email: mockEmail, scope: mockScope }, "test")
      .then((response) => {
        response.should.eq(mockMessageResponse);
      });
  });

  it("Custom endpoint: Leave resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/test/${mockProjectId}/leave`)
      .reply(200, mockMessageResponse);

    deepgram.invitation.leave(mockProjectId, "test").then((response) => {
      response.should.eq(mockMessageResponse);
    });
  });

  it("Custom endpoint: Delete resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/test/${mockProjectId}/invites/${mockEmail}`)
      .reply(200, mockMessageResponse);

    deepgram.invitation
      .delete(mockProjectId, mockEmail, "test")
      .then((response) => {
        response.should.eq(mockMessageResponse);
      });
  });
});
