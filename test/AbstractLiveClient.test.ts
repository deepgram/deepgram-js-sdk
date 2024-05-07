import { expect } from "chai";
import sinon from "sinon";
import { AbstractLiveClient } from "../src/packages/AbstractLiveClient";
import { DeepgramClientOptions } from "../src/lib/types";
import { CONNECTION_STATE, SOCKET_STATES } from "../src/lib/constants";

class TestLiveClient extends AbstractLiveClient {
  constructor(options: DeepgramClientOptions) {
    super(options);
  }

  setupConnection(): void {
    // Dummy implementation
  }
}

describe("AbstractLiveClient", () => {
  let liveClient: TestLiveClient;
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
    liveClient = new TestLiveClient(options);
  });

  it("should set the URL property correctly", () => {
    expect(liveClient.baseUrl).to.equal("wss://api.mock.deepgram.com");
  });

  it("should include the Authorization header", () => {
    expect(liveClient.headers).to.have.property("Authorization", "Token test-key");
  });

  it("should connect the socket", (done) => {
    // @ts-expect-error
    const connectSpy = sinon.spy(liveClient, "connect");
    const transcriptionOptions = { punctuate: true };
    const endpoint = "/v1/listen";
    // @ts-expect-error
    liveClient.connect(transcriptionOptions, endpoint);
    expect(connectSpy.calledOnce).to.be.true;
    done();
  });

  it("should reconnect the socket", () => {
    const reconnectSpy = sinon.spy(liveClient, "reconnect");
    const transcriptionOptions = { numerals: true };
    liveClient.reconnect(transcriptionOptions);
    expect(reconnectSpy.calledOnce).to.be.true;
  });

  it("should disconnect the socket", () => {
    const disconnectSpy = sinon.spy(liveClient, "disconnect");
    liveClient.disconnect();
    expect(disconnectSpy.calledOnce).to.be.true;
  });

  it("should return the correct connection state", () => {
    expect(liveClient.connectionState()).to.equal(CONNECTION_STATE.Closed);
    // @ts-expect-error
    liveClient.conn = { readyState: SOCKET_STATES.connecting };
    expect(liveClient.connectionState()).to.equal(CONNECTION_STATE.Connecting);
    // @ts-expect-error
    liveClient.conn = { readyState: SOCKET_STATES.open };
    expect(liveClient.connectionState()).to.equal(CONNECTION_STATE.Open);
    // @ts-expect-error
    liveClient.conn = { readyState: SOCKET_STATES.closing };
    expect(liveClient.connectionState()).to.equal(CONNECTION_STATE.Closing);
  });

  it("should return the correct ready state", () => {
    expect(liveClient.getReadyState()).to.equal(SOCKET_STATES.closed);
    // @ts-expect-error
    liveClient.conn = { readyState: SOCKET_STATES.connecting };
    expect(liveClient.getReadyState()).to.equal(SOCKET_STATES.connecting);
  });

  it("should check if the connection is open", () => {
    expect(liveClient.isConnected()).to.be.false;
    // @ts-expect-error
    liveClient.conn = { readyState: SOCKET_STATES.open };
    expect(liveClient.isConnected()).to.be.true;
  });

  it("should send data to the Deepgram API", () => {
    const sendSpy = sinon.spy(liveClient, "send");
    const data = new Blob(["test data"]);
    // @ts-expect-error
    liveClient.conn = { send: () => {} };
    liveClient.send(data);
    expect(sendSpy.calledOnce).to.be.true;
  });
});
