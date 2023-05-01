import chai, { assert } from "chai";
import { Deepgram } from "../src";
import {
  mockProjectKeysList,
  mockProjectKey,
  mockApiKey,
  mockApiDomain,
  mockProjectId,
  mockUuid,
} from "./mockResults";
import nock from "nock";

chai.should();

describe("Key tests", () => {
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
      .get(`/v1/projects/${mockProjectId}/keys`)
      .reply(200, mockProjectKeysList);

    deepgram.keys.list(mockProjectId).then((response) => {
      response.should.deep.eq(mockProjectKeysList);
    });
  });

  it("Get resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockProjectId}/keys/${mockUuid}`)
      .reply(200, mockProjectKey);

    deepgram.keys.get(mockProjectId, mockUuid).then((response) => {
      response.should.deep.eq(mockProjectKey);
    });
  });

  it("Create resolves", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/v1/projects/${mockProjectId}/keys`)
      .reply(200, mockProjectKey);

    deepgram.keys
      .create(mockProjectId, "Test Comment", ["member"])
      .then((response) => {
        response.should.deep.eq(mockProjectKey);
      });
  });

  it("Delete resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/v1/projects/${mockProjectId}/keys/${mockUuid}`)
      .reply(200);

    deepgram.keys
      .delete(mockProjectId, mockUuid)
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });

  it("Custom endpoint: List resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/keys`)
      .reply(200, mockProjectKeysList);

    deepgram.keys.list(mockProjectId, "test").then((response) => {
      response.should.deep.eq(mockProjectKeysList);
    });
  });

  it("Custom endpoint: Get resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockProjectId}/keys/${mockUuid}`)
      .reply(200, mockProjectKey);

    deepgram.keys.get(mockProjectId, mockUuid, "test").then((response) => {
      response.should.deep.eq(mockProjectKey);
    });
  });

  it("Custom endpoint: Create resolves", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/test/${mockProjectId}/keys`)
      .reply(200, mockProjectKey);

    deepgram.keys
      .create(mockProjectId, "Test Comment", ["member"], {}, "test")
      .then((response) => {
        response.should.deep.eq(mockProjectKey);
      });
  });

  it("Custom endpoint: Delete resolves", () => {
    nock(`https://${mockApiDomain}`)
      .delete(`/test/${mockProjectId}/keys/${mockUuid}`)
      .reply(200);

    deepgram.keys
      .delete(mockProjectId, mockUuid, "test")
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });

  it("Throws an exception if both expirationDate and timeToLive are provided", () => {
    const expectedError = `Please provide expirationDate or timeToLive or neither. Providing both is not allowed.`;

    deepgram.keys
      .create(mockProjectId, "test Comment", ["member"], {
        expirationDate: new Date(),
        timeToLive: 30,
      })
      .then(() => {
        assert.equal(1, 2);
      })
      .catch((err) => {
        assert.equal(err, expectedError);
      });
  });

  it("Does not throw if only timeToLive is provided as an option", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/v1/projects/${mockProjectId}/keys`)
      .reply(200, mockProjectKey);

    deepgram.keys
      .create(mockProjectId, "test Comment", ["member"], {
        timeToLive: 30,
      })
      .then((response) => {
        response.should.deep.eq(mockProjectKey);
      })
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });

  it("Does not throw if only expirationDate is provided as an option", () => {
    nock(`https://${mockApiDomain}`)
      .post(`/v1/projects/${mockProjectId}/keys`)
      .reply(200, mockProjectKey);

    deepgram.keys
      .create(mockProjectId, "test Comment", ["member"], {
        expirationDate: new Date(),
      })
      .then((response) => {
        response.should.deep.eq(mockProjectKey);
      })
      .then(() => {
        assert.equal(1, 1);
      })
      .catch((err) => {
        assert.equal(1, 2);
      });
  });
});
