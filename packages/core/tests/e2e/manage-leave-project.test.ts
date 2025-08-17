import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds } from "../__fixtures__/manage";

describe("manage leaveProject E2E", () => {
  let deepgram: ReturnType<typeof createClient>;

  beforeAll(() => {
    setupApiMocks();
    const apiKey = process.env.DEEPGRAM_API_KEY || "mock-api-key";
    deepgram = createClient(apiKey);
    expect.addSnapshotSerializer(structureOnlySerializer);
  });

  afterAll(() => {
    cleanupApiMocks();
  });

  it("should leave a project", async () => {
    const { result, error } = await deepgram.manage.leaveProject(testProjectIds.primary);

    expect(error).toBeNull();
    expect(result).toMatchSnapshot("manage-leaveProject-response-structure");
  });
});
