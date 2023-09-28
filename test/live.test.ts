import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { LiveConnectionState, LiveTranscriptionEvents } from "../src/lib/enums";

describe("connecting to our transcription websocket", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://deepgram-mock-api-server.fly.dev" },
    });
  });

  it("should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("should connect to the websocket", function (done) {
    const connection = deepgram.listen.live({ model: "general", tier: "enhanced" });

    connection.on(LiveTranscriptionEvents.Open, (event) => {
      expect(connection.getReadyState()).to.eq(LiveConnectionState.OPEN);

      connection.on(LiveTranscriptionEvents.Metadata, (data) => {
        assert.isNotNull(data);
        assert.containsAllDeepKeys(data, ["request_id"]);

        connection.finish();
        done();
      });
    });
  });

  it("should send data and recieve a transcription object back", function (done) {
    const connection = deepgram.listen.live({ model: "general", tier: "enhanced" });

    connection.on(LiveTranscriptionEvents.Open, () => {
      connection.on(LiveTranscriptionEvents.Metadata, (data) => {
        assert.isNotNull(data);
        assert.containsAllDeepKeys(data, ["request_id"]);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        assert.isNotNull(data);
        assert.containsAllDeepKeys(data, ["channel"]);

        connection.finish();
        done();
      });

      connection.send(new Uint8Array(100)); // mock ArrayBufferLike audio data
    });
  });

  it("should receive a warning if trying to send zero-byte length data", function (done) {
    const connection = deepgram.listen.live({ model: "general", tier: "enhanced" });

    connection.on(LiveTranscriptionEvents.Open, () => {
      connection.on(LiveTranscriptionEvents.Warning, (data) => {
        assert.isNotNull(data);

        expect(data).to.eq(
          "Zero-byte detected, skipping. Send `CloseStream` if trying to close the connection."
        );

        connection.finish();
        done();
      });

      connection.send(new Uint8Array(0));
    });
  });
});
