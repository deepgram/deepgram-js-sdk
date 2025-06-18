import { createClient } from "../../src/index";
import { setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";

describe("manage deleteProject E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    setupApiMocks();
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    deepgram = createClient(apiKey);
  });

  afterAll(() => {
    cleanupApiMocks();
  });

  it("should delete a project", async () => {
    const { error } = await deepgram.manage.deleteProject(testProjectIds.toDelete);

    expect(error).toBeNull();
  });
});
