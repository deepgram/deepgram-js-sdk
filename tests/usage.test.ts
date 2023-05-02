import chai, { assert } from "chai";
import { Deepgram } from "../src";
import querystring from "querystring";
import {
  mockApiDomain,
  mockApiKey,
  mockMessageResponse,
  mockUsage,
  mockUsageField,
  mockUsageFieldOptions,
  mockUsageOptions,
  mockUsageRequest,
  mockUsageRequestList,
  mockUsageRequestListOptions,
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

  it("List requests resolves", () => {
    const mockOptions = { ...{}, ...{} };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/requests?${querystring.stringify(
          mockOptions
        )}`
      )
      .reply(200, mockUsageRequestList);

    deepgram.usage.listRequests(mockUuid).then((response) => {
      response.should.deep.eq(mockUsageRequestList);
    });
  });

  it("List requests w/options resolves", () => {
    const mockOptions = { ...{}, ...mockUsageRequestListOptions };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/requests?${querystring.stringify(
          mockOptions
        )}`
      )
      .reply(200, mockUsageRequestList);

    deepgram.usage
      .listRequests(mockUuid, mockUsageRequestListOptions)
      .then((response) => {
        response.should.deep.eq(mockUsageRequestList);
      });
  });

  it("Get request resolves", () => {
    nock(`https://${mockApiDomain}`)
      .get(`/v1/projects/${mockUuid}/requests/${mockUuid}`)
      .reply(200, mockUsageRequest);

    deepgram.usage.getRequest(mockUuid, mockUuid).then((response) => {
      response.should.deep.eq(mockUsageRequest);
    });
  });

  it("Get usage resolves", () => {
    const mockOptions = { ...{}, ...{} };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/usage?${querystring.stringify(mockOptions)}`
      )
      .reply(200, mockUsage);

    deepgram.usage.getUsage(mockUuid).then((response) => {
      response.should.deep.eq(mockUsage);
    });
  });

  it("Get usage resolves w/ options resolves", () => {
    const mockOptions = { ...{}, ...mockUsageOptions };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/usage?${querystring.stringify(mockOptions)}`
      )
      .reply(200, mockUsage);

    deepgram.usage.getUsage(mockUuid, mockUsageOptions).then((response) => {
      response.should.deep.eq(mockUsage);
    });
  });

  it("Get fields resolves", () => {
    const mockOptions = { ...{}, ...{} };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/usage/fields?${querystring.stringify(
          mockOptions
        )}`
      )
      .reply(200, mockUsageField);

    deepgram.usage.getFields(mockUuid).then((response) => {
      response.should.deep.eq(mockUsageField);
    });
  });

  it("Get fields w/ options resolves", () => {
    const mockOptions = { ...{}, ...mockUsageFieldOptions };

    nock(`https://${mockApiDomain}`)
      .get(
        `/v1/projects/${mockUuid}/usage/fields?${querystring.stringify(
          mockOptions
        )}`
      )
      .reply(200, mockUsageField);

    deepgram.usage
      .getFields(mockUuid, mockUsageFieldOptions)
      .then((response) => {
        response.should.deep.eq(mockUsageField);
      });
  });
});
