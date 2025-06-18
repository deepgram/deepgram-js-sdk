import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, testModelIds } from "../__fixtures__/manage";

describe("manage getModel E2E", () => {
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

  it("should get a specific project model", async () => {
    const { result, error } = await deepgram.manage.getModel(
      testProjectIds.primary,
      testModelIds.sttModel
    );

    expect(error).toBeNull();
    expect(result).toMatchSnapshot("manage-getModel-stt-response-structure");
  });

  it("should get a different project model", async () => {
    const { result, error } = await deepgram.manage.getModel(
      testProjectIds.primary,
      testModelIds.ttsModel
    );

    expect(error).toBeNull();
    expect(result).toMatchSnapshot("manage-getModel-tts-response-structure");
  });
});
