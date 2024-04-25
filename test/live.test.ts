import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { LiveConnectionState, LiveTranscriptionEvents } from "../src/lib/enums";

describe("connecting to our transcription websocket", () => {
  let deepgram: DeepgramClient;

  before(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram" },
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

      done();
    });
  });
});
