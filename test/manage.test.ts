import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

describe("making manage requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://deepgram-mock-api-server.fly.dev" },
    });
  });

  it("should create the client object", () => {
    expect(deepgram).to.not.be.undefined;
    expect(deepgram).is.instanceOf(DeepgramClient);
  });

  it("should get all projects for a user", async () => {
    const { result, error } = await deepgram.manage.getProjects();

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["projects"]);
  });

  it("should get a project", async () => {
    const { result, error } = await deepgram.manage.getProject(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["project_id"]);
  });

  it("should update a project", async () => {
    const { result, error } = await deepgram.manage.updateProject(faker.string.uuid(), {
      name: "test",
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });

  it("should delete a project", async () => {
    const { error } = await deepgram.manage.deleteProject(faker.string.uuid());

    assert.isNull(error);
  });

  it("should get all project key details", async () => {
    const { result, error } = await deepgram.manage.getProjectKeys(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["api_keys"]);
  });

  it("should get a project key", async () => {
    const { result, error } = await deepgram.manage.getProjectKey(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.api_key, ["api_key_id"]);
  });

  it("should create a project key", async () => {
    const { result, error } = await deepgram.manage.createProjectKey(faker.string.uuid(), {
      comment: faker.lorem.words(4),
      scopes: [faker.lorem.word()],
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["key"]);
  });

  it("should delete a project key", async () => {
    const { error } = await deepgram.manage.deleteProjectKey(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
  });

  it("should get all project members", async () => {
    const { result, error } = await deepgram.manage.getProjectMembers(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["members"]);
  });

  it("should remove a project member", async () => {
    const { error } = await deepgram.manage.removeProjectMember(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
  });

  it("should get all scopes for a project member", async () => {
    const { result, error } = await deepgram.manage.getProjectMemberScopes(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["scopes"]);
  });

  it("should update a scope for a project member", async () => {
    const { result, error } = await deepgram.manage.updateProjectMemberScope(
      faker.string.uuid(),
      faker.string.uuid(),
      {
        scope: faker.lorem.word(),
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });

  it("should get all project invites", async () => {
    const { result, error } = await deepgram.manage.getProjectInvites(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["invites"]);
  });

  it("should send a project invite", async () => {
    const { result, error } = await deepgram.manage.sendProjectInvite(faker.string.uuid(), {
      email: faker.internet.email(),
      scope: faker.lorem.word(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });

  it("should delete a project invite", async () => {
    const { error } = await deepgram.manage.deleteProjectInvite(
      faker.string.uuid(),
      faker.internet.email()
    );

    assert.isNull(error);
  });

  it("should leave a project", async () => {
    const { result, error } = await deepgram.manage.leaveProject(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["message"]);
  });

  it("should get all usage requests for a project", async () => {
    const { result, error } = await deepgram.manage.getProjectUsageRequests(faker.string.uuid(), {
      start: faker.date.anytime().toISOString(),
      end: faker.date.anytime().toISOString(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["requests"]);
  });

  it("should get a usage request for a project", async () => {
    const { result, error } = await deepgram.manage.getProjectUsageRequest(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["response"]);
  });

  it("should get the project usage summary", async () => {
    const { result, error } = await deepgram.manage.getProjectUsageSummary(faker.string.uuid(), {
      start: faker.date.anytime().toISOString(),
      end: faker.date.anytime().toISOString(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["results"]);
  });

  it("should get project usage fields", async () => {
    const { result, error } = await deepgram.manage.getProjectUsageFields(faker.string.uuid(), {
      start: faker.date.anytime().toISOString(),
      end: faker.date.anytime().toISOString(),
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["models"]);
  });

  it("should get all project balances", async () => {
    const { result, error } = await deepgram.manage.getProjectBalances(faker.string.uuid());

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["balances"]);
  });

  it("should get a project balance", async () => {
    const { result, error } = await deepgram.manage.getProjectBalance(
      faker.string.uuid(),
      faker.string.uuid()
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["balance_id"]);
  });
});
