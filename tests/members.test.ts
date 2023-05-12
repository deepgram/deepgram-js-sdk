import chai from "chai";
import { Deepgram } from "../src";
import {
  mockProjectId,
  mockApiDomain,
  mockApiKey,
  mockMembers,
  mockUuid,
  mockMessageResponse,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Members tests", () => {
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

  it("List members resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/members`)
      .reply(200, mockMembers);

    deepgram.members.listMembers(mockProjectId).then((response) => {
      response.should.deep.eq(mockMembers);
    });
  });

  it("Remove member resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/v1/projects/${mockProjectId}/members/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.members.removeMember(mockProjectId, mockUuid).then((response) => {
      response.should.deep.eq(mockMessageResponse);
    });
  });

  it("Custom endpoint: List members resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/members`)
      .reply(200, mockMembers);

    deepgram.members.listMembers(mockProjectId, "test").then((response) => {
      response.should.deep.eq(mockMembers);
    });
  });

  it("Custom endpoint: Remove member resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/test/${mockProjectId}/members/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.members
      .removeMember(mockProjectId, mockUuid, "test")
      .then((response) => {
        response.should.deep.eq(mockMessageResponse);
      });
  });
});
