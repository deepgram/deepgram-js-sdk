import { createClient } from "../../src/index";
import { structureOnlySerializer, setupApiMocks, cleanupApiMocks } from "../__utils__";
import { testProjectIds, modelOptions } from "../__fixtures__/manage";

describe("manage getAllModels E2E", () => {
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

  it("should get all project models with basic options", async () => {
    const { result, error } = await deepgram.manage.getAllModels(
      testProjectIds.primary,
      modelOptions.basic
    );

    expect(error).toBeNull();
    expect(result).toMatchSnapshot("manage-getAllModels-basic-response-structure");
  });

  it("should get all project models with filtered options", async () => {
    const { result, error } = await deepgram.manage.getAllModels(
      testProjectIds.primary,
      modelOptions.withFilters
    );

    expect(error).toBeNull();
    expect(result).toMatchSnapshot("manage-getAllModels-filtered-response-structure");
  });
});
