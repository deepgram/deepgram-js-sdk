import { expect } from "chai";
import {
  DeepgramApiError,
  DeepgramError,
  DeepgramUnknownError,
  DeepgramVersionError,
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

describe("DeepgramError", () => {
  it("should have the correct name property", () => {
    const error = new DeepgramError("Test error");
    expect(error.name).to.equal("DeepgramError");
  });

  it("should extend the Error class", () => {
    const error = new DeepgramError("Test error");
    expect(error).to.be.an.instanceOf(Error);
  });

  it("should have the __dgError property set to true", () => {
    const error = new DeepgramError("Test error");
    expect(error).to.have.property("__dgError", true);
  });
});

describe("isDeepgramError", () => {
  it("should return true for DeepgramError instances", () => {
    const error = new DeepgramError("Test error");
    expect(isDeepgramError(error)).to.be.true;
  });

  it("should return false for non-DeepgramError objects", () => {
    const error = new Error("Test error");
    expect(isDeepgramError(error)).to.be.false;
  });

  it("should return false for non-objects", () => {
    expect(isDeepgramError(123)).to.be.false;
    expect(isDeepgramError("abc")).to.be.false;
    expect(isDeepgramError(null)).to.be.false;
    expect(isDeepgramError(undefined)).to.be.false;
  });
});

describe("DeepgramApiError", () => {
  it("should have the correct name property", () => {
    const error = new DeepgramApiError("Test error", 400);
    expect(error.name).to.equal("DeepgramApiError");
  });

  it("should extend the DeepgramError class", () => {
    const error = new DeepgramApiError("Test error", 400);
    expect(error).to.be.an.instanceOf(DeepgramError);
  });

  it("should have the correct status property", () => {
    const error = new DeepgramApiError("Test error", 400);
    expect(error.status).to.equal(400);
  });

  it("should correctly serialize to JSON", () => {
    const error = new DeepgramApiError("Test error", 400);
    const json = JSON.stringify(error);
    expect(json).to.equal('{"name":"DeepgramApiError","message":"Test error","status":400}');
  });
});

describe("DeepgramUnknownError", () => {
  it("should have the correct name property", () => {
    const originalError = new Error("Original error");
    const error = new DeepgramUnknownError("Test error", originalError);
    expect(error.name).to.equal("DeepgramUnknownError");
  });

  it("should extend the DeepgramError class", () => {
    const originalError = new Error("Original error");
    const error = new DeepgramUnknownError("Test error", originalError);
    expect(error).to.be.an.instanceOf(DeepgramError);
  });

  it("should have the correct originalError property", () => {
    const originalError = new Error("Original error");
    const error = new DeepgramUnknownError("Test error", originalError);
    expect(error.originalError).to.equal(originalError);
  });
});

describe("DeepgramVersionError", () => {
  it("should have the correct name property", () => {
    const error = new DeepgramVersionError();
    expect(error.name).to.equal("DeepgramVersionError");
  });

  it("should extend the DeepgramError class", () => {
    const error = new DeepgramVersionError();
    expect(error).to.be.an.instanceOf(DeepgramError);
  });

  it("should have the correct message property", () => {
    const error = new DeepgramVersionError();
    expect(error.message).to.equal(
      "You are attempting to use an old format for a newer SDK version. Read more here: https://dpgr.am/js-v3"
    );
  });
});
