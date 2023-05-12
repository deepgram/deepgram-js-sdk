import chai, { assert } from "chai";
import { Deepgram } from "../src";
import {
  mockApiDomain,
  mockApiKey,
  mockMessageResponse,
  mockScope,
  mockScopesList,
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

  it("Get scopes resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockUuid}/members/${mockUuid}/scopes`)
      .reply(200, mockScopesList);

    deepgram.scopes.get(mockUuid, mockUuid).then((response) => {
      response.should.deep.eq(mockScopesList);
    });
  });

  it("Update scopes resolves", () => {
    nock(`https://${mockApiDomain}`)
      .put(`/v1/projects/${mockUuid}/members/${mockUuid}/scopes`)
      .reply(200, mockMessageResponse);

    deepgram.scopes.update(mockUuid, mockUuid, mockScope).then((response) => {
      response.should.deep.eq(mockMessageResponse);
    });
  });

  it("Custom endpoint: Get scopes resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/test/${mockUuid}/members/${mockUuid}/scopes`)
      .reply(200, mockScopesList);

    deepgram.scopes.get(mockUuid, mockUuid, "test").then((response) => {
      response.should.deep.eq(mockScopesList);
    });
  });

  it("Custom endpoint: Update scopes resolves", () => {
    nock(`https://${mockApiDomain}`)
      .put(`/test/${mockUuid}/members/${mockUuid}/scopes`)
      .reply(200, mockMessageResponse);

    deepgram.scopes
      .update(mockUuid, mockUuid, mockScope, "test")
      .then((response) => {
        response.should.deep.eq(mockMessageResponse);
      });
  });
});
