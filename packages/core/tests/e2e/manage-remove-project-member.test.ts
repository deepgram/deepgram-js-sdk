import { createClient } from "../../src/index";
import { setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testMemberIds } from "../__fixtures__/manage";

describe("manage removeProjectMember E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    setupApiMocks();
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    deepgram = createClient(apiKey);
  });

  afterAll(() => {
    cleanupApiMocks();
  });

  it("should remove a project member", async () => {
    const { error } = await deepgram.manage.removeProjectMember(
      testProjectIds.primary,
      testMemberIds.toRemove
    );

    expect(error).toBeNull();
  });
});
