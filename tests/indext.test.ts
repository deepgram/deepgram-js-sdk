import chai, { expect } from "chai";
import Sinon, { assert } from "sinon";

import { Deepgram } from "../src";

chai.should();

describe("Constructor", () => {
  it("Providing no credentials returns error", () => {
    expect(() => {
      new Deepgram({ apiKey: "", apiSecret: "" });
    }).to.throw();
  });
});

describe("Transcribe tests", () => {
  it("Providing buffer without mimetype will return error", (done) => {
    const deepgram = new Deepgram({
      apiKey: "testKey",
      apiSecret: "testSecret",
    });

    deepgram.transcribe(Buffer.allocUnsafe(100)).catch((e) => {
      try {
        e.message.should.eq(
          "DG: Mimetype must be provided if the source is a Buffer"
        );
      } catch (assertionError) {
        done(assertionError);
        return;
      }
    });

    done();
  });
});
