---
name: deepgram-js-management-api
description: Use when writing or reviewing JavaScript/TypeScript in this repo that calls Deepgram Management APIs for projects, API keys, members, invites, requests, usage, billing, models, and agent think-model discovery. Covers `client.manage.v1.*` plus `client.agent.v1.settings.think.models.list()`. Use `deepgram-js-voice-agent` when you want to run an agent live rather than administer projects or inspect models. Triggers include "management API", "list projects", "API keys", "members", "invites", "usage stats", "billing", "list models", and "manage.v1".
---

# Using Deepgram Management API (JavaScript / TypeScript SDK)

Administrative REST endpoints under `/v1/projects`, `/v1/models`, and related project subresources.

**Use a different skill when:** live agent session → `deepgram-js-voice-agent`; transcription or synthesis → product-specific skills.

## Authentication

```js
require("dotenv").config();

const { DeepgramClient } = require("@deepgram/sdk");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});
```

Most examples also rely on `process.env.DEEPGRAM_PROJECT_ID` for project-scoped calls.

## Quick start — projects + models

From `examples/13-management-projects.ts`, `examples/19-management-models.ts`, and `examples/32-management-project-models.ts`:

```js
const projectId = process.env.DEEPGRAM_PROJECT_ID;

const projects = await deepgramClient.manage.v1.projects.list();
console.log("Projects:", JSON.stringify(projects, null, 2));

const project = await deepgramClient.manage.v1.projects.get(projects.projects[0].project_id);
await deepgramClient.manage.v1.projects.update(project.project_id, {
  name: "Naomi's Sandbox",
});

const models = await deepgramClient.manage.v1.models.list();
const projectModels = await deepgramClient.manage.v1.projects.models.list(
  projectId,
  { include_outdated: false },
);
```

## Quick start — keys / members / invites / usage / billing

Based on `examples/14-18`:

```js
const projectId = process.env.DEEPGRAM_PROJECT_ID;

await deepgramClient.manage.v1.projects.keys.list(projectId);
await deepgramClient.manage.v1.projects.members.list(projectId);
await deepgramClient.manage.v1.projects.members.invites.create(projectId, {
  email: "user@example.com",
  scope: "member",
});
await deepgramClient.manage.v1.projects.requests.list(projectId, {});
await deepgramClient.manage.v1.projects.usage.get(projectId, {});
await deepgramClient.manage.v1.projects.billing.balances.list(projectId);
```

Think-model discovery for Voice Agent:

```js
await deepgramClient.agent.v1.settings.think.models.list();
```

## Workflow for destructive operations

1. **List** the resources first (e.g., `projects.keys.list(projectId)`).
2. **Confirm** the target ID with the user before proceeding.
3. **Execute** the delete/leave/remove call.
4. **Verify** by listing again to confirm deletion.

## Key parameters / API surface

- Projects: `client.manage.v1.projects.list/get/update/delete/leave`.
- Keys: `client.manage.v1.projects.keys.list/create/get/delete`.
- Members: `client.manage.v1.projects.members.list/delete` and `members.scopes.list/update`.
- Invites: `client.manage.v1.projects.members.invites.list/create/delete`.
- Requests + usage: `projects.requests.list/get`, `projects.usage.get`, `projects.usage.breakdown.list`, `projects.usage.fields.list`.
- Billing: `projects.billing.balances.*`, `projects.billing.breakdown.list`, `projects.billing.fields.list`, `projects.billing.purchases.list`.
- Models: `client.manage.v1.models.list/get` and `client.manage.v1.projects.models.list/get`.

## Limitations

The current JS SDK does **not** expose persisted Voice Agent configuration CRUD endpoints. The repo surfaces `client.agent.v1.settings.think.models.list()` for discovery, but not `voice_agent.configurations.*`-style helpers.

## API reference (layered)

1. **In-repo reference**: `reference.md` → `Manage V1 Models`, `Manage V1 Projects`, `Manage V1 Projects Keys`, `Members`, `Models`, `Requests`, `Usage`, `Billing *`, plus `Agent V1 Settings Think Models`.
2. **Canonical OpenAPI (REST)**: https://developers.deepgram.com/openapi.yaml
3. **Canonical AsyncAPI (WSS)**: https://developers.deepgram.com/asyncapi.yaml
4. **Context7**: library ID `/llmstxt/developers_deepgram_llms_txt`
5. **Product docs**:
   - https://developers.deepgram.com/reference/manage/projects/list
   - https://developers.deepgram.com/reference/manage/models/list
   - https://developers.deepgram.com/reference/voice-agent/agent-configurations/list-agent-configurations
   - https://developers.deepgram.com/reference/voice-agent/agent-configurations/create-agent-configuration
   - https://developers.deepgram.com/reference/voice-agent/think-models

## Gotchas

1. **Namespace depth matters.** Most admin calls live under `client.manage.v1.projects.*`, not on the root client.
2. **Project-scoped and global models differ.** `/v1/models` returns public models; `/v1/projects/{id}/models` can include private/custom access.
3. **`projects.usage.get(...)` is marked deprecated in source.** Prefer `projects.usage.breakdown.list(...)` for richer reporting.
4. **Destructive operations are real.** `delete`, `leave`, member removal, and key deletion are not safe example calls.
5. **Management APIs are not the same as regional STT routing.** `examples/33-configuration-eu-endpoint.ts` explicitly notes management stays on the default US endpoint.
6. **Returned IDs can be nested.** Example key lookup uses `keys.api_keys[0].api_key.api_key_id`; inspect real response shape before hard-coding paths.
7. **No persisted agent config helpers are present.** If you need Voice Agent configuration CRUD, use raw HTTP for now.

## Example files in this repo

`examples/13-management-projects.ts` through `examples/19-management-models.ts`, plus `examples/29-32-*` for usage breakdown, billing details, member permissions, and project models.

## Central product skills

For cross-language Deepgram product knowledge, install `npx skills add deepgram/skills`.
