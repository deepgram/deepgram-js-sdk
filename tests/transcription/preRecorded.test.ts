import chai from "chai";
import { Deepgram } from "../../src";
import querystring from "querystring";
import {
  mockApiDomain,
  mockApiKey,
  mockBuffer,
  mockBufferSource,
  mockPrerecordedOptions,
  mockPrerecordedResponse,
  mockReadStreamSource,
  mockReadable,
  mockUrlSource,
} from "../mockResults";
import nock from "nock";

chai.should();

describe("Pre-recorded transcription tests", () => {
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

  it("Transcribe URL source", () => {
    const mockOptions = { ...{}, ...mockPrerecordedOptions };

    nock(`https://${mockApiDomain}`)
      .post(`/v1/listen?${querystring.stringify(mockOptions)}`)
      .reply(200, mockPrerecordedResponse);

    deepgram.transcription
      .preRecorded(mockUrlSource, mockPrerecordedOptions)
      .then((response) => {
        response.should.deep.eq(mockPrerecordedResponse);
      });
  });

  it("Transcribe read stream", () => {
    const mockOptions = { ...{}, ...mockPrerecordedOptions };

    nock(`https://${mockApiDomain}`)
      .post(`/v1/listen?${querystring.stringify(mockOptions)}`)
      .reply(200, mockPrerecordedResponse);

    deepgram.transcription
      .preRecorded(mockReadStreamSource, mockPrerecordedOptions)
      .then((response) => {
        response.should.deep.eq(mockPrerecordedResponse);
      });
  });

  it("Transcribe buffer", () => {
    const mockOptions = { ...{}, ...mockPrerecordedOptions };

    nock(`https://${mockApiDomain}`)
      .post(`/v1/listen?${querystring.stringify(mockOptions)}`)
      .reply(200, mockPrerecordedResponse);

    deepgram.transcription
      .preRecorded(mockBufferSource, mockPrerecordedOptions)
      .then((response) => {
        response.should.deep.eq(mockPrerecordedResponse);
      });
  });

  it("Transcribe buffer errors without mimetype", () => {
    deepgram.transcription
      .preRecorded({ buffer: mockBuffer, mimetype: "" }, mockPrerecordedOptions)
      .catch((e) => {
        e.message.should.eq(
          "DG: Mimetype must be provided if the source is a Buffer or a Readable"
        );
      });
  });

  it("Transcribe read stream errors without mimetype", () => {
    deepgram.transcription
      .preRecorded(
        { stream: mockReadable, mimetype: "" },
        mockPrerecordedOptions
      )
      .catch((e) => {
        e.message.should.eq(
          "DG: Mimetype must be provided if the source is a Buffer or a Readable"
        );
      });
  });

  it("Transcribe empty read stream errors", () => {
    deepgram.transcription
      .preRecorded(
        // @ts-ignore
        { stream: null, mimetype: "video/mpeg" },
        mockPrerecordedOptions
      )
      .catch((e) => {
        e.message.should.eq("Unknown TranscriptionSource type");
      });
  });

  it("Transcribe unknown source type errors", () => {
    deepgram.transcription
      // @ts-ignore
      .preRecorded({ blah: "test" }, mockPrerecordedOptions)
      .catch((e) => {
        e.message.should.eq("Unknown TranscriptionSource type");
      });
  });

  it("Custom endpoint: Transcribe URL source", () => {
    const mockOptions = { ...{}, ...mockPrerecordedOptions };

    nock(`https://${mockApiDomain}`)
      .post(`/test?${querystring.stringify(mockOptions)}`)
      .reply(200, mockPrerecordedResponse);

    deepgram.transcription
      .preRecorded(mockUrlSource, mockPrerecordedOptions, "test")
      .then((response) => {
        response.should.deep.eq(mockPrerecordedResponse);
      });
  });

  it("Transcribe URL source with arbitrary options", () => {
    const mockOptions = { ...{ blah: "test" }, ...mockPrerecordedOptions };

    nock(`https://${mockApiDomain}`)
      .post(`/v1/listen?${querystring.stringify(mockOptions)}`)
      .reply(200, mockPrerecordedResponse);

    deepgram.transcription
      .preRecorded(mockUrlSource, mockOptions)
      .then((response) => {
        response.should.deep.eq(mockPrerecordedResponse);
      });
  });
});
