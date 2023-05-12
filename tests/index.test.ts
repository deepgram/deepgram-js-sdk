import chai, { expect } from "chai";
import { Deepgram } from "../src";

chai.should();

describe("Constructor", () => {
  it("Providing no credentials returns error", () => {
    expect(() => {
      new Deepgram("");
    }).to.throw();
  });
});
