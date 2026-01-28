import { describe, it, expect } from "vitest";
import { DeepgramError, DeepgramTimeoutError } from "../../src/errors";
import { handleNonStatusCodeError } from "../../src/errors/handleNonStatusCodeError";
import type * as core from "../../src/core";

/**
 * Tests for error handling and error classes.
 *
 * These tests verify:
 * 1. DeepgramError construction and message building
 * 2. DeepgramTimeoutError construction
 * 3. handleNonStatusCodeError function
 * 4. Error inheritance and stack traces
 */
describe("Error classes", () => {
  describe("DeepgramError", () => {
    it("should create error with message only", () => {
      const error = new DeepgramError({ message: "Something went wrong" });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DeepgramError);
      expect(error.message).toBe("Something went wrong");
      expect(error.statusCode).toBeUndefined();
      expect(error.body).toBeUndefined();
      expect(error.name).toBe("DeepgramError");
    });

    it("should create error with status code", () => {
      const error = new DeepgramError({
        message: "Unauthorized",
        statusCode: 401
      });

      expect(error.message).toContain("Unauthorized");
      expect(error.message).toContain("Status code: 401");
      expect(error.statusCode).toBe(401);
    });

    it("should create error with body", () => {
      const body = { error: "Invalid API key", code: "AUTH_FAILED" };
      const error = new DeepgramError({
        message: "Authentication failed",
        statusCode: 401,
        body
      });

      expect(error.message).toContain("Authentication failed");
      expect(error.message).toContain("Status code: 401");
      expect(error.message).toContain("Body:");
      expect(error.body).toEqual(body);
    });

    it("should create error with raw response", () => {
      const rawResponse = {
        headers: new Headers({ "content-type": "application/json" }),
        status: 500
      } as core.RawResponse;

      const error = new DeepgramError({
        message: "Server error",
        statusCode: 500,
        rawResponse
      });

      expect(error.rawResponse).toBe(rawResponse);
    });

    it("should have proper stack trace", () => {
      const error = new DeepgramError({ message: "Test error" });

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("DeepgramError");
    });

    it("should handle empty constructor", () => {
      const error = new DeepgramError({});

      expect(error).toBeInstanceOf(DeepgramError);
      expect(error.message).toBe("");
    });

    it("should serialize body in message", () => {
      const body = { nested: { deeply: { value: 123 } } };
      const error = new DeepgramError({ body });

      expect(error.message).toContain("Body:");
      expect(error.message).toContain("nested");
      expect(error.message).toContain("123");
    });
  });

  describe("DeepgramTimeoutError", () => {
    it("should create timeout error with message", () => {
      const error = new DeepgramTimeoutError("Request timed out after 30 seconds");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DeepgramTimeoutError);
      expect(error.message).toBe("Request timed out after 30 seconds");
      expect(error.name).toBe("DeepgramTimeoutError");
    });

    it("should have proper stack trace", () => {
      const error = new DeepgramTimeoutError("Timeout");

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("DeepgramTimeoutError");
    });

    it("should be catchable as Error", () => {
      const error = new DeepgramTimeoutError("Timeout");

      expect(() => {
        throw error;
      }).toThrow(Error);
    });
  });
});

describe("handleNonStatusCodeError", () => {
  const mockRawResponse = {
    headers: new Headers(),
    status: 200
  } as core.RawResponse;

  it("should throw DeepgramError for non-json response", () => {
    const error: core.Fetcher.Error = {
      reason: "non-json",
      statusCode: 500,
      rawBody: "Internal Server Error"
    };

    expect(() => {
      handleNonStatusCodeError(error, mockRawResponse, "POST", "/v1/listen");
    }).toThrow(DeepgramError);

    try {
      handleNonStatusCodeError(error, mockRawResponse, "POST", "/v1/listen");
    } catch (e) {
      expect(e).toBeInstanceOf(DeepgramError);
      expect((e as DeepgramError).statusCode).toBe(500);
      expect((e as DeepgramError).body).toBe("Internal Server Error");
    }
  });

  it("should throw DeepgramError for null body", () => {
    const error: core.Fetcher.Error = {
      reason: "body-is-null",
      statusCode: 204
    };

    expect(() => {
      handleNonStatusCodeError(error, mockRawResponse, "DELETE", "/v1/projects/123");
    }).toThrow(DeepgramError);

    try {
      handleNonStatusCodeError(error, mockRawResponse, "DELETE", "/v1/projects/123");
    } catch (e) {
      expect(e).toBeInstanceOf(DeepgramError);
      expect((e as DeepgramError).statusCode).toBe(204);
    }
  });

  it("should throw DeepgramTimeoutError for timeout", () => {
    const error: core.Fetcher.Error = {
      reason: "timeout"
    };

    expect(() => {
      handleNonStatusCodeError(error, mockRawResponse, "POST", "/v1/listen");
    }).toThrow(DeepgramTimeoutError);

    try {
      handleNonStatusCodeError(error, mockRawResponse, "POST", "/v1/listen");
    } catch (e) {
      expect(e).toBeInstanceOf(DeepgramTimeoutError);
      expect((e as DeepgramTimeoutError).message).toContain("POST /v1/listen");
    }
  });

  it("should throw DeepgramError for unknown error", () => {
    const error: core.Fetcher.Error = {
      reason: "unknown",
      errorMessage: "Network error"
    };

    expect(() => {
      handleNonStatusCodeError(error, mockRawResponse, "GET", "/v1/projects");
    }).toThrow(DeepgramError);

    try {
      handleNonStatusCodeError(error, mockRawResponse, "GET", "/v1/projects");
    } catch (e) {
      expect(e).toBeInstanceOf(DeepgramError);
      expect((e as DeepgramError).message).toContain("Network error");
    }
  });

  it("should handle unrecognized error reasons", () => {
    const error = {
      reason: "some-other-reason"
    } as unknown as core.Fetcher.Error;

    expect(() => {
      handleNonStatusCodeError(error, mockRawResponse, "GET", "/v1/test");
    }).toThrow(DeepgramError);

    try {
      handleNonStatusCodeError(error, mockRawResponse, "GET", "/v1/test");
    } catch (e) {
      expect(e).toBeInstanceOf(DeepgramError);
      expect((e as DeepgramError).message).toContain("Unknown error");
    }
  });
});

describe("Error inheritance chain", () => {
  it("DeepgramError should be instanceof Error", () => {
    const error = new DeepgramError({ message: "test" });
    expect(error instanceof Error).toBe(true);
  });

  it("DeepgramTimeoutError should be instanceof Error", () => {
    const error = new DeepgramTimeoutError("test");
    expect(error instanceof Error).toBe(true);
  });

  it("errors should be catchable in try-catch", () => {
    let caught = false;

    try {
      throw new DeepgramError({ message: "test" });
    } catch (e) {
      caught = true;
      expect(e).toBeInstanceOf(DeepgramError);
    }

    expect(caught).toBe(true);
  });

  it("should preserve prototype chain for instanceof checks", () => {
    const deepgramError = new DeepgramError({ message: "test" });
    const timeoutError = new DeepgramTimeoutError("test");

    // Both should be Error instances
    expect(Object.getPrototypeOf(deepgramError)).toBeInstanceOf(Error);
    expect(Object.getPrototypeOf(timeoutError)).toBeInstanceOf(Error);

    // Check prototype chain integrity
    expect(deepgramError.constructor.name).toBe("DeepgramError");
    expect(timeoutError.constructor.name).toBe("DeepgramTimeoutError");
  });
});

describe("Error message formatting", () => {
  it("should format error with all fields", () => {
    const error = new DeepgramError({
      message: "Request failed",
      statusCode: 400,
      body: { error: "Bad request", details: "Missing required field 'url'" }
    });

    const lines = error.message.split("\n");
    expect(lines[0]).toBe("Request failed");
    expect(lines[1]).toBe("Status code: 400");
    expect(lines[2]).toContain("Body:");
  });

  it("should handle missing fields gracefully", () => {
    const errorMessageOnly = new DeepgramError({ message: "Error" });
    expect(errorMessageOnly.message).toBe("Error");
    expect(errorMessageOnly.message.includes("Status code")).toBe(false);
    expect(errorMessageOnly.message.includes("Body")).toBe(false);

    const errorStatusOnly = new DeepgramError({ statusCode: 500 });
    expect(errorStatusOnly.message).toBe("Status code: 500");

    const errorBodyOnly = new DeepgramError({ body: { test: true } });
    expect(errorBodyOnly.message).toContain("Body:");
  });
});
