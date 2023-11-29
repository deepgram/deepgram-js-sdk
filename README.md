# Deepgram JavaScript SDK

[![Discord](https://dcbadge.vercel.app/api/server/xWRaCDBtW4?style=flat)](https://discord.gg/xWRaCDBtW4) [![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official JavaScript SDK for [Deepgram](https://www.deepgram.com/). Power your apps with world-class speech and Language AI models.

- [Migrating from v2](#migrating-from-v2)
- [Installation](#installation)
  - [UMD](#umd)
  - [ESM](#esm)
- [Initialization](#initialization)
  - [Getting an API Key](#getting-an-api-key)
- [Scoped Configuration](#scoped-configuration)
  - [Rest requests in the browser](#rest-requests-in-the-browser)
- [Transcription (Synchronous)](#transcription-synchronous)
  - [Remote Files](#remote-files)
  - [Local Files](#local-files)
- [Transcription (Asynchronous / Callbacks)](#transcription-asynchronous--callbacks)
  - [Remote Files](#remote-files-1)
  - [Local Files](#local-files-1)
- [Transcription (Live / Streaming)](#transcription-live--streaming)
  - [Live Audio](#live-audio)
- [Transcribing to captions](#transcribing-to-captions)
- [Projects](#projects)
  - [Get Projects](#get-projects)
  - [Get Project](#get-project)
  - [Update Project](#update-project)
  - [Delete Project](#delete-project)
- [Keys](#keys)
  - [List Keys](#list-keys)
  - [Get Key](#get-key)
  - [Create Key](#create-key)
  - [Delete Key](#delete-key)
- [Members](#members)
  - [Get Members](#get-members)
  - [Remove Member](#remove-member)
- [Scopes](#scopes)
  - [Get Member Scopes](#get-member-scopes)
  - [Update Scope](#update-scope)
- [Invitations](#invitations)
  - [List Invites](#list-invites)
  - [Send Invite](#send-invite)
  - [Delete Invite](#delete-invite)
  - [Leave Project](#leave-project)
- [Usage](#usage)
  - [Get All Requests](#get-all-requests)
  - [Get Request](#get-request)
  - [Summarize Usage](#summarize-usage)
  - [Get Fields](#get-fields)
- [Billing](#billing)
  - [Get All Balances](#get-all-balances)
  - [Get Balance](#get-balance)
- [On-Prem APIs](#on-prem-apis)
  - [List On-Prem credentials](#list-on-prem-credentials)
  - [Get On-Prem credentials](#get-on-prem-credentials)
  - [Create On-Prem credentials](#create-on-prem-credentials)
  - [Delete On-Prem credentials](#delete-on-prem-credentials)
- [Development and Contributing](#development-and-contributing)
  - [Debugging and making changes locally](#debugging-and-making-changes-locally)
- [Getting Help](#getting-help)

# Migrating from v2

We have published [a migration guide on our docs](https://developers.deepgram.com/docs/js-sdk-v2-to-v3-migration-guide), showing how to move from v2 to v3.

# Installation

You can install this SDK directly from [npm](https://www.npmjs.com/package/@deepgram/sdk).

```bash
npm install @deepgram/sdk
# - or -
# yarn add @deepgram/sdk
```

## UMD

You can now use plain `<script>`s to import deepgram from CDNs, like:

```html
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
```

or even:

```html
<script src="https://unpkg.com/@deepgram/sdk"></script>
```

Then you can use it from a global deepgram variable:

```html
<script>
  const { createClient } = deepgram;
  const _deepgram = createClient("deepgram-api-key");

  console.log("Deepgram Instance: ", _deepgram);
  // ...
</script>
```

## ESM

You can now use type="module" `<script>`s to import deepgram from CDNs, like:

```html
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
  const deepgram = createClient("deepgram-api-key");

  console.log("Deepgram Instance: ", deepgram);
  // ...
</script>
```

# Initialization

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const deepgram = createClient(DEEPGRAM_API_KEY);
```

## Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

# Scoped Configuration

A new feature is scoped configuration. You'll be able to configure various aspects of the SDK from the initialization.

```js
import { createClient } from "@deepgram/sdk";
// - or -
// const { createClient } = require("@deepgram/sdk");

const deepgram = createClient(DEEPGRAM_API_KEY, {
  global: { url: "https://api.beta.deepgram.com" },
  // restProxy: { url: "http://localhost:8080" }
});
```

## Rest requests in the browser

This SDK now works in the browser. If you'd like to make REST-based requests (pre-recorded transcription, on-premise, and management requests), then you'll need to use a proxy as we do not support custom CORS origins on our API. To set up your proxy, you configure the SDK like so:

```js
import { createClient } from "@deepgram/sdk";

const deepgram = createClient("proxy", {
  restProxy: { url: "http://localhost:8080" },
});
```

> Important: You must pass `"proxy"` as your API key, and use the proxy to set the `Authorization` header to your Deepgram API key.

Your proxy service should replace the Authorization header with `Authorization: token <DEEPGRAM_API_KEY>` and return results verbatim to the SDK.

Check out our example Node-based proxy here: [Deepgram Node Proxy](https://github.com/deepgram-devs/deepgram-node-proxy).

# Transcription (Synchronous)

## Remote Files

```js
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  {
    model: "nova",
  }
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

## Local Files

```js
const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
  fs.createReadStream("./examples/spacewalk.wav"),
  {
    model: "nova",
  }
);
```

or

```js
const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
  fs.readFileSync("./examples/spacewalk.wav"),
  {
    model: "nova",
  }
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

# Transcription (Asynchronous / Callbacks)

## Remote Files

```js
import { CallbackUrl } from "@deepgram/sdk";

const { result, error } = await deepgram.listen.prerecorded.transcribeUrlCallback(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  new CallbackUrl("http://callback/endpoint"),
  {
    model: "nova",
  }
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

## Local Files

```js
import { CallbackUrl } from "@deepgram/sdk";

const { result, error } = await deepgram.listen.prerecorded.transcribeFileCallback(
  fs.createReadStream("./examples/spacewalk.wav"),
  new CallbackUrl("http://callback/endpoint"),
  {
    model: "nova",
  }
);
```

or

```js
import { CallbackUrl } from "@deepgram/sdk";

const { result, error } = await deepgram.listen.prerecorded.transcribeFileCallback(
  fs.readFileSync("./examples/spacewalk.wav"),
  new CallbackUrl("http://callback/endpoint"),
  {
    model: "nova",
  }
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

# Transcription (Live / Streaming)

## Live Audio

```js
const dgConnection = deepgram.listen.live({ model: "nova" });

dgConnection.on(LiveTranscriptionEvents.Open, () => {
  dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log(data);
  });

  source.addListener("got-some-audio", async (event) => {
    dgConnection.send(event.raw_audio_data);
  });
});
```

To see an example, [check out our Node.js example](https://github.com/deepgram-devs/node-live-example) or our [Browser example](https://github.com/deepgram-devs/js-live-example).

[See our API reference for more info](https://developers.deepgram.com/reference/streaming).

# Transcribing to captions

```js
import { webvtt /* , srt */ } from "@deepgram/captions";

const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  {
    model: "nova",
  }
);

const vttOutput = webvtt(result);
// const srtOutput = srt(result);
```

[See our standalone captions library for more information](https://github.com/deepgram/deepgram-node-captions).

# Projects

## Get Projects

Returns all projects accessible by the API key.

```js
const { result, error } = await deepgram.manage.getProjects();
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-projects).

## Get Project

Retrieves a specific project based on the provided project_id.

```js
const { result, error } = await deepgram.manage.getProject(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-project).

## Update Project

Update a project.

```js
const { result, error } = await deepgram.manage.updateProject(projectId, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/update-project).

## Delete Project

Delete a project.

```js
const { error } = await deepgram.manage.deleteProject(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-project).

# Keys

## List Keys

Retrieves all keys associated with the provided project_id.

```js
const { result, error } = await deepgram.manage.getProjectKeys(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/list-keys).

## Get Key

Retrieves a specific key associated with the provided project_id.

```js
const { result, error } = await deepgram.manage.getProjectKey(projectId, projectKeyId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-key).

## Create Key

Creates an API key with the provided scopes.

```js
const { result, error } = await deepgram.manage.createProjectKey(projectId, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/create-key).

## Delete Key

Deletes a specific key associated with the provided project_id.

```js
const { error } = await deepgram.manage.deleteProjectKey(projectId, projectKeyId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-key).

# Members

## Get Members

Retrieves account objects for all of the accounts in the specified project_id.

```js
const { result, error } = await deepgram.manage.getProjectMembers(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-members).

## Remove Member

Removes member account for specified member_id.

```js
const { error } = await deepgram.manage.removeProjectMember(projectId, projectMemberId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/remove-member).

# Scopes

## Get Member Scopes

Retrieves scopes of the specified member in the specified project.

```js
const { result, error } = await deepgram.manage.getProjectMemberScopes(projectId, projectMemberId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-member-scopes).

## Update Scope

Updates the scope for the specified member in the specified project.

```js
const { result, error } = await deepgram.manage.updateProjectMemberScope(
  projectId,
  projectMemberId,
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/update-scope).

# Invitations

## List Invites

Retrieves all invitations associated with the provided project_id.

```js
const { result, error } = await deepgram.manage.getProjectInvites(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/list-invites).

## Send Invite

Sends an invitation to the provided email address.

```js
const { result, error } = await deepgram.manage.sendProjectInvite(projectId, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/send-invites).

## Delete Invite

Removes the specified invitation from the project.

```js
const { error } = await deepgram.manage.deleteProjectInvite(projectId, email);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-invite).

## Leave Project

Removes the authenticated user from the project.

```js
const { result, error } = await deepgram.manage.leaveProject(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/leave-project).

# Usage

## Get All Requests

Retrieves all requests associated with the provided project_id based on the provided options.

```js
const { result, error } = await deepgram.manage.getProjectUsageRequest(projectId, requestId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-all-requests).

## Get Request

Retrieves a specific request associated with the provided project_id.

```js
const { result, error } = await deepgram.manage.getProjectUsageRequest(projectId, requestId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-request).

## Summarize Usage

Retrieves usage associated with the provided project_id based on the provided options.

```js
const { result, error } = await deepgram.manage.getProjectUsageSummary(projectId, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/summarize-usage).

## Get Fields

Lists the features, models, tags, languages, and processing method used for requests in the specified project.

```js
const { result, error } = await deepgram.manage.getProjectUsageFields(projectId, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-fields).

# Billing

## Get All Balances

Retrieves the list of balance info for the specified project.

```js
const { result, error } = await deepgram.manage.getProjectBalances(projectId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-all-balances).

## Get Balance

Retrieves the balance info for the specified project and balance_id.

```js
const { result, error } = await deepgram.manage.getProjectBalance(projectId, balanceId);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-balance).

# On-Prem APIs

## List On-Prem credentials

```js
const { result, error } = await deepgram.onprem.listCredentials(projectId);
```

## Get On-Prem credentials

```js
const { result, error } = await deepgram.onprem.getCredentials(projectId, credentialId);
```

## Create On-Prem credentials

```js
const { result, error } = await deepgram.onprem.createCredentials(projectId, options);
```

## Delete On-Prem credentials

```js
const { result, error } = await deepgram.onprem.deleteCredentials(projectId, credentialId);
```

# Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

## Debugging and making changes locally

If you want to make local changes to the SDK and run the [`examples/`](./examples/), you'll need to `npm run build` first, to ensure that your changes are included in the examples that are running.

# Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue in this repository](https://github.com/deepgram/deepgram-node-sdk/issues/new)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
- [Join the Deepgram Github Discussions Community](https://github.com/orgs/deepgram/discussions)
