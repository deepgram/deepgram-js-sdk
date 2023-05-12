import chai, { assert } from "chai";
import { Deepgram } from "../src";
import {
  mockApiDomain,
  mockApiKey,
  mockMessageResponse,
  mockProject,
  mockProjectId,
  mockProjectUpdate,
  mockProjects,
  mockUuid,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Projects tests", () => {
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

  it("List projects resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects`)
      .reply(200, mockProjects);

    deepgram.projects.list().then((response) => {
      response.should.deep.eq(mockProjects);
    });
  });

  it("Get project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockUuid}`)
      .reply(200, mockProject);

    deepgram.projects.get(mockUuid).then((response) => {
      response.should.deep.eq(mockProject);
    });
  });

  it("Update project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .patch(`/v1/projects/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.projects
      .update(mockProject, mockProjectUpdate)
      .then((response) => {
        response.should.deep.eq(mockMessageResponse);
      });
  });

  it("Delete project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/v1/projects/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.projects
      .delete(mockProjectId)
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });

  it("Custom endpoint: List projects resolves", () => {
    nock(`https://${mockApiDomain}`).get(`/test`).reply(200, mockProjects);

    deepgram.projects.list("test").then((response) => {
      response.should.deep.eq(mockProjects);
    });
  });

  it("Custom endpoint: Get project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockUuid}`)
      .reply(200, mockProject);

    deepgram.projects.get(mockUuid, "test").then((response) => {
      response.should.deep.eq(mockProject);
    });
  });

  it("Custom endpoint: Update project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .patch(`/test/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.projects
      .update(mockProject, mockProjectUpdate, "test")
      .then((response) => {
        response.should.deep.eq(mockMessageResponse);
      });
  });

  it("Custom endpoint: Delete project resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/test/${mockUuid}`)
      .reply(200, mockMessageResponse);

    deepgram.projects
      .delete(mockProjectId, "test")
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });
});
