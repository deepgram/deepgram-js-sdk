import chai from "chai";

import { transcribe } from "../src/batch";

chai.should();

describe("Batch tests", () => {
  it("Providing buffer without mimetype will return error", (done) => {
    transcribe("testKey:testSecret", "fakeUrl", Buffer.allocUnsafe(100)).catch(
      (e) => {
        try {
          e.message.should.eq(
            "DG: Mimetype must be provided if the source is a Buffer"
          );
        } catch (assertionError) {
          done(assertionError);
          return;
        }
      }
    );

    done();
  });
});
