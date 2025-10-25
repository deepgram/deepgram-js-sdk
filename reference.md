# Reference

## Agent V1 Settings Think Models

<details><summary><code>client.agent.v1.settings.think.models.<a href="/src/api/resources/agent/resources/v1/resources/settings/resources/think/resources/models/client/Client.ts">list</a>() -> Deepgram.AgentThinkModelsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the available think models that can be used for AI agent processing

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agent.v1.settings.think.models.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Auth V1 Tokens

<details><summary><code>client.auth.v1.tokens.<a href="/src/api/resources/auth/resources/v1/resources/tokens/client/Client.ts">grant</a>({ ...params }) -> Deepgram.GrantV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates a temporary JSON Web Token (JWT) with a 30-second (by default) TTL and usage::write permission for core voice APIs, requiring an API key with Member or higher authorization. Tokens created with this endpoint will not work with the Manage APIs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.auth.v1.tokens.grant();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Deepgram.auth.v1.GrantV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tokens.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Listen V1 Media

<details><summary><code>client.listen.v1.media.<a href="/src/api/resources/listen/resources/v1/resources/media/client/Client.ts">transcribeUrl</a>({ ...params }) -> Deepgram.MediaTranscribeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transcribe audio and video using Deepgram's speech-to-text REST API

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.listen.v1.media.transcribeUrl({
    callback: "callback",
    callback_method: "POST",
    extra: "extra",
    sentiment: true,
    summarize: "v2",
    tag: "tag",
    topics: true,
    custom_topic: "custom_topic",
    custom_topic_mode: "extended",
    intents: true,
    custom_intent: "custom_intent",
    custom_intent_mode: "extended",
    detect_entities: true,
    detect_language: true,
    diarize: true,
    dictation: true,
    encoding: "linear16",
    filler_words: true,
    keywords: "keywords",
    language: "language",
    measurements: true,
    model: "nova-3",
    multichannel: true,
    numerals: true,
    paragraphs: true,
    profanity_filter: true,
    punctuate: true,
    redact: "redact",
    replace: "replace",
    search: "search",
    smart_format: true,
    utterances: true,
    utt_split: 1.1,
    version: "latest",
    mip_opt_out: true,
    url: "https://dpgr.am/spacewalk.wav",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Deepgram.listen.v1.ListenV1RequestUrl`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Media.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.listen.v1.media.<a href="/src/api/resources/listen/resources/v1/resources/media/client/Client.ts">transcribeFile</a>(uploadable, { ...params }) -> Deepgram.MediaTranscribeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transcribe audio and video using Deepgram's speech-to-text REST API

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**uploadable:** `core.file.Uploadable`

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.listen.v1.MediaTranscribeRequestOctetStream`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Media.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Models

<details><summary><code>client.manage.v1.models.<a href="/src/api/resources/manage/resources/v1/resources/models/client/Client.ts">list</a>({ ...params }) -> Deepgram.ListModelsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata on all the latest public models. To retrieve custom models, use Get Project Models.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.models.list({
    include_outdated: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Deepgram.manage.v1.ModelsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.models.<a href="/src/api/resources/manage/resources/v1/resources/models/client/Client.ts">get</a>(modelId) -> Deepgram.GetModelV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata for a specific public model

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.models.get("af6e9977-99f6-4d8f-b6f5-dfdf6fb6e291");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**modelId:** `string` — The specific UUID of the model

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects

<details><summary><code>client.manage.v1.projects.<a href="/src/api/resources/manage/resources/v1/resources/projects/client/Client.ts">list</a>() -> Deepgram.ListProjectsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves basic information about the projects associated with the API key

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.<a href="/src/api/resources/manage/resources/v1/resources/projects/client/Client.ts">get</a>(projectId, { ...params }) -> Deepgram.GetProjectV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves information about the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.get("123456-7890-1234-5678-901234", {
    limit: 1.1,
    page: 1.1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.ProjectsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.<a href="/src/api/resources/manage/resources/v1/resources/projects/client/Client.ts">delete</a>(projectId) -> Deepgram.DeleteProjectV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.delete("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.<a href="/src/api/resources/manage/resources/v1/resources/projects/client/Client.ts">update</a>(projectId, { ...params }) -> Deepgram.UpdateProjectV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the name or other properties of an existing project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.update("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.UpdateProjectV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.<a href="/src/api/resources/manage/resources/v1/resources/projects/client/Client.ts">leave</a>(projectId) -> Deepgram.LeaveProjectV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes the authenticated account from the specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.leave("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Keys

<details><summary><code>client.manage.v1.projects.keys.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/keys/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.ListProjectKeysV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves all API keys associated with the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.keys.list("123456-7890-1234-5678-901234", {
    status: "active",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.KeysListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Keys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.keys.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/keys/client/Client.ts">create</a>(projectId, { ...params }) -> Deepgram.CreateKeyV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new API key with specified settings for the project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.keys.create("project_id", {
    key: "value",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.CreateKeyV1RequestOne`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Keys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.keys.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/keys/client/Client.ts">get</a>(projectId, keyId) -> Deepgram.GetProjectKeyV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves information about a specified API key

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.keys.get("123456-7890-1234-5678-901234", "123456789012345678901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — The unique identifier of the API key

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Keys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.keys.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/keys/client/Client.ts">delete</a>(projectId, keyId) -> Deepgram.DeleteProjectKeyV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an API key for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.keys.delete("123456-7890-1234-5678-901234", "123456789012345678901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — The unique identifier of the API key

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Keys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Members

<details><summary><code>client.manage.v1.projects.members.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/client/Client.ts">list</a>(projectId) -> Deepgram.ListProjectMembersV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a list of members for a given project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.list("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Members.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.members.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/client/Client.ts">delete</a>(projectId, memberId) -> Deepgram.DeleteProjectMemberV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a member from the project using their unique member ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.delete("123456-7890-1234-5678-901234", "123456789012345678901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**memberId:** `string` — The unique identifier of the Member

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Members.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Models

<details><summary><code>client.manage.v1.projects.models.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/models/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.ListModelsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata on all the latest models that a specific project has access to, including non-public models

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.models.list("123456-7890-1234-5678-901234", {
    include_outdated: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.ModelsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.models.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/models/client/Client.ts">get</a>(projectId, modelId) -> Deepgram.GetModelV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata for a specific model

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.models.get("123456-7890-1234-5678-901234", "af6e9977-99f6-4d8f-b6f5-dfdf6fb6e291");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**modelId:** `string` — The specific UUID of the model

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Requests

<details><summary><code>client.manage.v1.projects.requests.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/requests/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.ListProjectRequestsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates a list of requests for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.requests.list("123456-7890-1234-5678-901234", {
    start: "2024-01-15T09:30:00Z",
    end: "2024-01-15T09:30:00Z",
    limit: 1.1,
    page: 1.1,
    accessor: "12345678-1234-1234-1234-123456789012",
    request_id: "12345678-1234-1234-1234-123456789012",
    deployment: "hosted",
    endpoint: "listen",
    method: "sync",
    status: "succeeded",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.RequestsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Requests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.requests.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/requests/client/Client.ts">get</a>(projectId, requestId) -> Deepgram.GetProjectRequestV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a specific request for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.requests.get("123456-7890-1234-5678-901234", "123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestId:** `string` — The unique identifier of the request

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Requests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Usage

<details><summary><code>client.manage.v1.projects.usage.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/usage/client/Client.ts">get</a>(projectId, { ...params }) -> Deepgram.UsageV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the usage for a specific project. Use Get Project Usage Breakdown for a more comprehensive usage summary.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.usage.get("123456-7890-1234-5678-901234", {
    start: "start",
    end: "end",
    accessor: "12345678-1234-1234-1234-123456789012",
    alternatives: true,
    callback_method: true,
    callback: true,
    channels: true,
    custom_intent_mode: true,
    custom_intent: true,
    custom_topic_mode: true,
    custom_topic: true,
    deployment: "hosted",
    detect_entities: true,
    detect_language: true,
    diarize: true,
    dictation: true,
    encoding: true,
    endpoint: "listen",
    extra: true,
    filler_words: true,
    intents: true,
    keyterm: true,
    keywords: true,
    language: true,
    measurements: true,
    method: "sync",
    model: "6f548761-c9c0-429a-9315-11a1d28499c8",
    multichannel: true,
    numerals: true,
    paragraphs: true,
    profanity_filter: true,
    punctuate: true,
    redact: true,
    replace: true,
    sample_rate: true,
    search: true,
    sentiment: true,
    smart_format: true,
    summarize: true,
    tag: "tag1",
    topics: true,
    utt_split: true,
    utterances: true,
    version: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.UsageGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Usage.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Billing Balances

<details><summary><code>client.manage.v1.projects.billing.balances.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/balances/client/Client.ts">list</a>(projectId) -> Deepgram.ListProjectBalancesV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates a list of outstanding balances for the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.billing.balances.list("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Balances.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.billing.balances.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/balances/client/Client.ts">get</a>(projectId, balanceId) -> Deepgram.GetProjectBalanceV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves details about the specified balance

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.billing.balances.get("123456-7890-1234-5678-901234", "123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**balanceId:** `string` — The unique identifier of the balance

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Balances.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Billing Breakdown

<details><summary><code>client.manage.v1.projects.billing.breakdown.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/breakdown/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.BillingBreakdownV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the billing summary for a specific project, with various filter options or by grouping options.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.billing.breakdown.list("123456-7890-1234-5678-901234", {
    start: "start",
    end: "end",
    accessor: "12345678-1234-1234-1234-123456789012",
    deployment: "hosted",
    tag: "tag1",
    line_item: "streaming::nova-3",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.billing.BreakdownListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Breakdown.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Billing Purchases

<details><summary><code>client.manage.v1.projects.billing.purchases.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/purchases/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.ListProjectPurchasesV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the original purchased amount on an order transaction

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.billing.purchases.list("123456-7890-1234-5678-901234", {
    limit: 1.1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.billing.PurchasesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Purchases.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Members Invites

<details><summary><code>client.manage.v1.projects.members.invites.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/invites/client/Client.ts">list</a>(projectId) -> Deepgram.ListProjectInvitesV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates a list of invites for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.invites.list("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.members.invites.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/invites/client/Client.ts">create</a>(projectId, { ...params }) -> Deepgram.CreateProjectInviteV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates an invite for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.invites.create("123456-7890-1234-5678-901234", {
    email: "email",
    scope: "scope",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.members.CreateProjectInviteV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.members.invites.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/invites/client/Client.ts">delete</a>(projectId, email) -> Deepgram.DeleteProjectInviteV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an invite for a specific project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.invites.delete("123456-7890-1234-5678-901234", "john.doe@example.com");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**email:** `string` — The email address of the member

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Members Scopes

<details><summary><code>client.manage.v1.projects.members.scopes.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/scopes/client/Client.ts">list</a>(projectId, memberId) -> Deepgram.ListProjectMemberScopesV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a list of scopes for a specific member

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.scopes.list("123456-7890-1234-5678-901234", "123456789012345678901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**memberId:** `string` — The unique identifier of the Member

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Scopes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.manage.v1.projects.members.scopes.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/scopes/client/Client.ts">update</a>(projectId, memberId, { ...params }) -> Deepgram.UpdateProjectMemberScopesV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the scopes for a specific member

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.members.scopes.update("123456-7890-1234-5678-901234", "123456789012345678901234", {
    scope: "admin",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**memberId:** `string` — The unique identifier of the Member

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.members.UpdateProjectMemberScopesV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Scopes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Usage Breakdown

<details><summary><code>client.manage.v1.projects.usage.breakdown.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/client/Client.ts">get</a>(projectId, { ...params }) -> Deepgram.UsageBreakdownV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the usage breakdown for a specific project, with various filter options by API feature or by groupings. Setting a feature (e.g. diarize) to true includes requests that used that feature, while false excludes requests that used it. Multiple true filters are combined with OR logic, while false filters use AND logic.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.usage.breakdown.get("123456-7890-1234-5678-901234", {
    start: "start",
    end: "end",
    grouping: "accessor",
    accessor: "12345678-1234-1234-1234-123456789012",
    alternatives: true,
    callback_method: true,
    callback: true,
    channels: true,
    custom_intent_mode: true,
    custom_intent: true,
    custom_topic_mode: true,
    custom_topic: true,
    deployment: "hosted",
    detect_entities: true,
    detect_language: true,
    diarize: true,
    dictation: true,
    encoding: true,
    endpoint: "listen",
    extra: true,
    filler_words: true,
    intents: true,
    keyterm: true,
    keywords: true,
    language: true,
    measurements: true,
    method: "sync",
    model: "6f548761-c9c0-429a-9315-11a1d28499c8",
    multichannel: true,
    numerals: true,
    paragraphs: true,
    profanity_filter: true,
    punctuate: true,
    redact: true,
    replace: true,
    sample_rate: true,
    search: true,
    sentiment: true,
    smart_format: true,
    summarize: true,
    tag: "tag1",
    topics: true,
    utt_split: true,
    utterances: true,
    version: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.usage.BreakdownGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Breakdown.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage V1 Projects Usage Fields

<details><summary><code>client.manage.v1.projects.usage.fields.<a href="/src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/fields/client/Client.ts">list</a>(projectId, { ...params }) -> Deepgram.UsageFieldsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the features, models, tags, languages, and processing method used for requests in the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manage.v1.projects.usage.fields.list("123456-7890-1234-5678-901234", {
    start: "start",
    end: "end",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.manage.v1.projects.usage.FieldsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Fields.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Read V1 Text

<details><summary><code>client.read.v1.text.<a href="/src/api/resources/read/resources/v1/resources/text/client/Client.ts">analyze</a>({ ...params }) -> Deepgram.ReadV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Analyze text content using Deepgrams text analysis API

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.read.v1.text.analyze({
    callback: "callback",
    callback_method: "POST",
    sentiment: true,
    summarize: "v2",
    tag: "tag",
    topics: true,
    custom_topic: "custom_topic",
    custom_topic_mode: "extended",
    intents: true,
    custom_intent: "custom_intent",
    custom_intent_mode: "extended",
    language: "language",
    body: {
        url: "url",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Deepgram.read.v1.TextAnalyzeRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Text.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## SelfHosted V1 DistributionCredentials

<details><summary><code>client.selfHosted.v1.distributionCredentials.<a href="/src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/client/Client.ts">list</a>(projectId) -> Deepgram.ListProjectDistributionCredentialsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists sets of distribution credentials for the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.selfHosted.v1.distributionCredentials.list("123456-7890-1234-5678-901234");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DistributionCredentials.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.selfHosted.v1.distributionCredentials.<a href="/src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/client/Client.ts">create</a>(projectId, { ...params }) -> Deepgram.CreateProjectDistributionCredentialsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a set of distribution credentials for the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.selfHosted.v1.distributionCredentials.create("123456-7890-1234-5678-901234", {
    provider: "quay",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**request:** `Deepgram.selfHosted.v1.CreateProjectDistributionCredentialsV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DistributionCredentials.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.selfHosted.v1.distributionCredentials.<a href="/src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/client/Client.ts">get</a>(projectId, distributionCredentialsId) -> Deepgram.GetProjectDistributionCredentialsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a set of distribution credentials for the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.selfHosted.v1.distributionCredentials.get(
    "123456-7890-1234-5678-901234",
    "8b36cfd0-472f-4a21-833f-2d6343c3a2f3",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**distributionCredentialsId:** `string` — The UUID of the distribution credentials

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DistributionCredentials.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.selfHosted.v1.distributionCredentials.<a href="/src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/client/Client.ts">delete</a>(projectId, distributionCredentialsId) -> Deepgram.GetProjectDistributionCredentialsV1Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a set of distribution credentials for the specified project

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.selfHosted.v1.distributionCredentials.delete(
    "123456-7890-1234-5678-901234",
    "8b36cfd0-472f-4a21-833f-2d6343c3a2f3",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The unique identifier of the project

</dd>
</dl>

<dl>
<dd>

**distributionCredentialsId:** `string` — The UUID of the distribution credentials

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DistributionCredentials.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Speak V1 Audio

<details><summary><code>client.speak.v1.audio.<a href="/src/api/resources/speak/resources/v1/resources/audio/client/Client.ts">generate</a>({ ...params }) -> core.BinaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Convert text into natural-sounding speech using Deepgram's TTS REST API

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speak.v1.audio.generate({
    text: "text",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Deepgram.speak.v1.SpeakV1Request`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
