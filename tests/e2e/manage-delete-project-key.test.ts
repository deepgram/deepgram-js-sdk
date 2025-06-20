import { createClient } from "../../src/index";
import { setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testKeyIds } from "../__fixtures__/manage";

describe("manage deleteProjectKey E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    setupApiMocks();
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    deepgram = createClient(apiKey);
  });

  afterAll(() => {
    cleanupApiMocks();
  });

  it("should delete a project key", async () => {
    const { error } = await deepgram.manage.deleteProjectKey(
      testProjectIds.primary,
      testKeyIds.toDelete
    );

    expect(error).toBeNull();
  });
});
