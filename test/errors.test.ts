import { expect } from "chai";
import {
  DeepgramApiError,
  DeepgramError,
  DeepgramUnknownError,
  isDeepgramError,
} from "../src/lib/errors";

describe("testing errors", () => {
  it("we can create an API error", () => {
    const error = new DeepgramError("Testing an error");
    expect(error).to.not.be.undefined;
    expect(isDeepgramError(error)).equals(true);
    expect(error).is.instanceOf(DeepgramError);
  });

  it("an API error will convert to JSON", () => {
    const error = new DeepgramApiError("Testing an error", 400);
    expect(JSON.stringify(error)).equals(
      '{"name":"DeepgramApiError","message":"Testing an error","status":400}'
    );
    expect(error).is.instanceOf(DeepgramApiError);
  });

  it("an unknown error is still an error", () => {
    const error = new Error("Testing an error");
    const dgError = new DeepgramUnknownError("Unknown error test", error);
    expect(isDeepgramError(dgError)).equals(true);
    expect(dgError).is.instanceOf(DeepgramUnknownError);
  });
});
