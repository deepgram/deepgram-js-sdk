import { assert, expect } from "chai";
import { createClient, Deepgram, DeepgramVersionError } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

const errorText =
  "You are attempting to use an old format for a newer SDK version. Read more here: https://dpgr.am/js-v3";

describe("legacy error handling", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  it("should create the correct client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("should error when using a v2 client object", async () => {
    assert.throw(
      () => {
        new Deepgram(faker.string.alphanumeric(40));
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for transcription", async () => {
    assert.throw(
      () => {
        deepgram.transcription.preRecorded(
          {
            url: "https://dpgr.am/spacewalk.wav",
          },
          {
            model: "nova",
            callback: "http://callback/endpoint",
          }
        );
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for projects", async () => {
    assert.throw(
      () => {
        deepgram.projects.list();
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for keys", async () => {
    assert.throw(
      () => {
        deepgram.keys.list("projectId");
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for members", async () => {
    assert.throw(
      () => {
        deepgram.members.listMembers("projectId");
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for scopes", async () => {
    assert.throw(
      () => {
        deepgram.scopes.get("projectId", "projectMemberId");
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for invitation", async () => {
    assert.throw(
      () => {
        deepgram.invitation.list("projectId");
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for usage", async () => {
    assert.throw(
      () => {
        deepgram.usage.listRequests("projectId", {});
      },
      DeepgramVersionError,
      errorText
    );
  });

  it("should error when using an old v2 callstack for billing", async () => {
    assert.throw(
      () => {
        deepgram.billing.listBalances("projectId");
      },
      DeepgramVersionError,
      errorText
    );
  });
});
