# Deepgram Node.js SDK

[![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official Node.js SDK for [Deepgram](https://www.deepgram.com/). Start building with our powerful transcription & speech understanding API.
> This SDK only supports hosted usage of api.deepgram.com.

> ### Deprecated JS Browser SDK
>
> As of version 2.x, the JS Browser SDK was removed from the Node SDK and will become an independent Client SDK.
> To use the older SDK, please `npm i @deepgram/sdk@1.2.1` and use `@deepgram/sdk/browser`.

* [Deepgram Node.js SDK](#deepgram-nodejs-sdk)
* [Getting an API Key](#getting-an-api-key)
* [Installation](#installation)
* [Constructor](#constructor)
* [Transcription](#transcription)
  * [Remote Files](#remote-files)
  * [Local Files](#local-files)
  * [Live Audio](#live-audio)
* [Projects](#projects)
  * [Get Projects](#get-projects)
  * [Get Project](#get-project)
  * [Update Project](#update-project)
  * [Delete Project](#delete-project)
* [Keys](#keys)
  * [List Keys](#list-keys)
  * [Get Key](#get-key)
  * [Create Key](#create-key)
  * [Delete Key](#delete-key)
* [Members](#members)
  * [Get Members](#get-members)
  * [Remove Member](#remove-member)
* [Scopes](#scopes)
  * [Get Member Scopes](#get-member-scopes)
  * [Update Scope](#update-scope)
* [Invitations](#invitations)
  * [List Invites](#list-invites)
  * [Send Invite](#send-invite)
  * [Delete Invite](#delete-invite)
  * [Leave Project](#leave-project)
* [Usage](#usage)
  * [Get All Requests](#get-all-requests)
  * [Get Request](#get-request)
  * [Summarize Usage](#summarize-usage)
  * [Get Fields](#get-fields)
* [Billing](#billing)
  * [Get All Balances](#get-all-balances)
  * [Get Balance](#get-balance)
* [Development and Contributing](#development-and-contributing)
* [Getting Help](#getting-help)

# Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

# Installation

```bash
npm install @deepgram/sdk
# - or -
# yarn add @deepgram/sdk
```

# Constructor

```js
const { Deepgram } = require("@deepgram/sdk");
// - or -
// import { Deepgram } from "@deepgram/sdk";

const deepgram = new Deepgram(DEEPGRAM_API_KEY);
```

# Transcription

## Remote Files

```js
const response = await deepgram.transcription.preRecorded(
  { url: URL_OF_FILE },
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

## Local Files

```js
const response = await deepgram.transcription.preRecorded(
  {
    stream: fs.createReadStream("/path/to/file"),
    mimetype: MIMETYPE_OF_FILE,
  },
  options
);
```

[See our API reference for more info](https://developers.deepgram.com/reference/pre-recorded).

## Live Audio

```js
const ws = dg.transcription.live(options);

// source.addListener('got-some-audio', async (event) => {
ws.send(event);
// })
```

See an example, here: [https://github.com/deepgram-devs/node-live-example](https://github.com/deepgram-devs/node-live-example).

[See our API reference for more info](https://developers.deepgram.com/reference/streaming).

# Projects

## Get Projects

Returns all projects accessible by the API key.

```js
const result = await deepgram.projects.list();
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-projects).

## Get Project

Retrieves a specific project based on the provided project_id.

```js
const result = await deepgram.projects.get(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-project).

## Update Project

Update a project.

```js
const result = await deepgram.projects.update(project_id, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/update-project).

## Delete Project

Delete a project.

```js
await deepgram.projects.delete(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-project).

# Keys

## List Keys

Retrieves all keys associated with the provided project_id.

```js
const result = await deepgram.keys.list(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/list-keys).

## Get Key

Retrieves a specific key associated with the provided project_id.

```js
const result = await deepgram.keys.get(project_id, key_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-key).

## Create Key

Creates an API key with the provided scopes.

```js
let scopes = ["member", "etc"];
const result = await deepgram.keys.create(project_id, comment, scopes, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/create-key).

## Delete Key

Deletes a specific key associated with the provided project_id.

```js
await deepgram.keys.delete(project_id, key_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-key).

# Members

## Get Members

Retrieves account objects for all of the accounts in the specified project_id.

```js
const result = await deepgram.members.listMembers(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-members).

## Remove Member

Removes member account for specified member_id.

```js
const result = await deepgram.members.removeMember(project_id, member_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/remove-member).

# Scopes

## Get Member Scopes

Retrieves scopes of the specified member in the specified project.

```js
const result = await deepgram.scopes.get(project_id, member_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-member-scopes).

## Update Scope

Updates the scope for the specified member in the specified project.

```js
let scope = "member:read";
const result = await deepgram.scopes.update(project_id, member_id, scope);
```

[See our API reference for more info](https://developers.deepgram.com/reference/update-scope).

# Invitations

## List Invites

Retrieves all invitations associated with the provided project_id.

```js
const result = await deepgram.invitations.list(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/list-invites).

## Send Invite

Sends an invitation to the provided email address.

```js
const result = await deepgram.invitation.send(project_id, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/send-invites).

## Delete Invite

Removes the specified invitation from the project.

```js
let email = "devrel@deepgram.com";
const result = await deepgram.invitation.delete(project_id, email);
```

[See our API reference for more info](https://developers.deepgram.com/reference/delete-invite).

## Leave Project

Removes the authenticated user from the project.

```js
const result = await deepgram.invitation.leave(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/leave-project).

# Usage

## Get All Requests

Retrieves all requests associated with the provided project_id based on the provided options.

```js
const result = await deepgram.usage.listRequests(project_id, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-all-requests).

## Get Request

Retrieves a specific request associated with the provided project_id.

```js
const result = await deepgram.usage.getRequest(project_id, request_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-request).

## Summarize Usage

Retrieves usage associated with the provided project_id based on the provided options.

```js
const result = await deepgram.usage.getUsage(project_id, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/summarize-usage).

## Get Fields

Lists the features, models, tags, languages, and processing method used for requests in the specified project.

```js
const result = await deepgram.usage.getFields(project_id, options);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-fields).

# Billing

## Get All Balances

Retrieves the list of balance info for the specified project.

```js
const result = await deepgram.billing.listBalances(project_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-all-balances).

## Get Balance

Retrieves the balance info for the specified project and balance_id.

```js
const result = await deepgram.billing.getBalance(project_id, balance_id);
```

[See our API reference for more info](https://developers.deepgram.com/reference/get-balance).

# Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

# Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue in this repository](https://github.com/deepgram/node-sdk/issues/new)
- [Join the Deepgram Github Discussions Community](https://github.com/orgs/deepgram/discussions)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
