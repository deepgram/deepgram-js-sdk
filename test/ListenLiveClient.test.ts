import { expect } from "chai";
import sinon from "sinon";
import { ListenLiveClient } from "../src/packages/ListenLiveClient";
import { DeepgramClientOptions, LiveConfigOptions } from "../src/lib/types";
import { LiveTranscriptionEvents } from "../src/lib/enums";

describe("ListenLiveClient", () => {
  let liveClient: ListenLiveClient;
  const options: DeepgramClientOptions = {
    key: "test-key",
    global: {
      websocket: {
        options: {
          url: "wss://api.mock.deepgram.com",
        },
      },
    },
  };

  beforeEach(() => {
    liveClient = new ListenLiveClient(options);
  });

  it("should set the namespace property correctly", () => {
    expect(liveClient.namespace).to.equal("listen");
  });

  it("should set up the connection event handlers", () => {
    const eventSpy = sinon.spy(liveClient, "emit");

    liveClient.setupConnection();

    // Simulate connection events
    // @ts-expect-error
    liveClient.conn.onopen();
    // @ts-expect-error
    liveClient.conn.onclose({});
    // @ts-expect-error
    liveClient.conn.onmessage({
      data: JSON.stringify({
        type: LiveTranscriptionEvents.Transcript,
        data: {},
      }),
    });

    expect(eventSpy.calledWith(LiveTranscriptionEvents.Open, liveClient)).to.be.true;
    expect(eventSpy.calledWith(LiveTranscriptionEvents.Close, {})).to.be.true;
    expect(
      eventSpy.calledWith(LiveTranscriptionEvents.Transcript, {
        type: LiveTranscriptionEvents.Transcript,
        data: {},
      })
    ).to.be.true;
  });

  it("should configure the live client", () => {
    const sendSpy = sinon.spy(liveClient, "send");
    const config: LiveConfigOptions = { numerals: true };
    liveClient.configure(config);
    expect(sendSpy.calledWith(JSON.stringify({ type: "Configure", processors: config }))).to.be
      .true;
  });

  it("should send a KeepAlive message", () => {
    const sendSpy = sinon.spy(liveClient, "send");
    liveClient.keepAlive();
    expect(sendSpy.calledWith(JSON.stringify({ type: "KeepAlive" }))).to.be.true;
  });

  it("should request to close the connection", () => {
    const sendSpy = sinon.spy(liveClient, "send");
    liveClient.requestClose();
    expect(sendSpy.calledWith(JSON.stringify({ type: "CloseStream" }))).to.be.true;
  });
});
