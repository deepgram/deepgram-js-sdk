import chai from "chai";
import { createReadStream } from "fs";

import { preRecordedTranscription } from "../../src/transcription/preRecordedTranscription";

chai.should();

describe("Transcription: Pre-recorded tests", () => {
  it("Providing buffer without mimetype will return error", (done) => {
    preRecordedTranscription("testKey:testSecret", "fakeUrl", {
      buffer: Buffer.allocUnsafe(100),
      mimetype: "",
    }).catch((e) => {
      try {
        e.message.should.eq(
          "DG: Mimetype must be provided if the source is a Buffer or a ReadStream"
        );
        done();
      } catch (assertionError) {
        done(assertionError);
        return;
      }
    });
  });

  it("Providing readstream without mimetype will return error", (done) => {
    preRecordedTranscription("testKey:testSecret", "fakeUrl", {
      stream: createReadStream("/dev/null"),
      mimetype: "",
    }).catch((e) => {
      try {
        e.message.should.eq(
          "DG: Mimetype must be provided if the source is a Buffer or a ReadStream"
        );
        done();
      } catch (assertionError) {
        done(assertionError);
        return;
      }
    });
  });
});
