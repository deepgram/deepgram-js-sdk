# Deepgram Node.js SDK

[![CI](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml/badge.svg)](https://github.com/deepgram/node-sdk/actions/workflows/CI.yml) [![npm (scoped)](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-rounded)](CODE_OF_CONDUCT.md)

Official Node.js SDK for [Deepgram](https://www.deepgram.com/)'s automated
speech recognition APIs.

> This SDK only supports hosted usage of api.deepgram.com.

To access the API you will need a Deepgram account. Sign up for free at
[signup][signup].

## Documentation

Full documentation of the Node.js SDK can be found on the
[Deepgram Developer Portal](https://developers.deepgram.com/sdks-tools/sdks/node-sdk/).

You can learn more about the full Deepgram API at [https://developers.deepgram.com](https://developers.deepgram.com).

## Installation

### With NPM

```bash
npm install @deepgram/sdk
```

### With Yarn

```bash
yarn add @deepgram/sdk
```

## Constructor

```js
const { Deepgram } = require("@deepgram/sdk");

const deepgram = new Deepgram(DEEPGRAM_API_KEY);
```

# Examples

## Transcription

### Pre-recorded

#### Remote Files

```js
const fileSource = { url: URL_OF_FILE };

const response = await deepgram.transcription.preRecorded(fileSource, {
  punctuate: true,
});
```

#### Local Files

```js
const streamSource = {
  stream: fs.createReadStream("/path/to/file"),
  mimetype: MIMETYPE_OF_FILE,
};

const response = await deepgram.transcription.preRecorded(streamSource, {
  punctuate: true,
});
```

### Transcribe Audio in Real-Time

See an example real time project at https://github.com/deepgram-devs/node-live-example, or visit this [Getting Started guide](https://developers.deepgram.com/documentation/getting-started/streaming/)

### Usage

#### listRequests
Retrieves all requests associated with the provided project_id based on the provided options.
```js
deepgram.usage
  .listRequests("84b227ad-dfac-4096-82f6-f7397006050b", {
    start: "2022-07-01",
    end: "2022-07-28",
  })
  .then((response) => {
    console.log("Usage: ", response);
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```
#### getRequest
Retrieves a specific request associated with the provided project_id.
```js
deepgram.usage
  .getRequest(
    // projectId
    "84b227ad-dfac-4096-82f6-f7397006050b",
    // requestId
    "f12cc224-282b-4de4-90f1-651d5fdf04f1"
  )
  .then((response) => {
    fs.writeFileSync(
      `usage.json`,
      JSON.stringify(response),
      () => `Wrote json`
    );
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### getUsage
Retrieves usage associated with the provided project_id based on the provided options.
```js 
deepgram.usage
  .getUsage("84b227ad-dfac-4096-82f6-f7397006050b", {
    punctuate: true,
    diarize: true
  })
  .then((response) => {
    console.log("Usage: ", response);
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

### getFields
Retrieves features used by the provided project_id based on the provided options.
```js
deepgram.usage
  .getFields("84b227ad-dfac-4096-82f6-f7397006050b", {
    start: "2022-07-01",
    end: "2022-07-28",
  })
  .then((response) => {
    console.log("Usage: ", response);
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

### Scopes
#### get
Retrieves scopes of the specified member in the specified project.
```js
deepgram.scopes
  .get(
    "84b227ad-dfac-4096-82f6-f7397006050b",
    "f12cc224-282b-4de4-90f1-651d5fdf04f1"
  )
  .then((response) => {
    fs.writeFileSync(
      `scope.json`,
      JSON.stringify(response),
      () => `Wrote json`
    );
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### update
Updates the scope for the specified member in the specified project.
```js
deepgram.scopes
  .update(
    "84b227ad-dfac-4096-82f6-f7397006050b",
    "f12cc224-282b-4de4-90f1-651d5fdf04f1",
    "member:read"
  )
  .then((response) => {
    console.log({response})
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

### Projects
#### list
Returns all projects accessible by the API key.
```js
deepgram.projects
  .list()
  .then((response) => {
    console.log("list", response);
  })
  .catch((err) => {
    console.log("err", err);
  });
```

#### get
Retrieves a specific project based on the provided project_id.
```js
deepgram.projects
  .get("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((response) => {
    console.log("list", response);
  })
  .catch((err) => {
    console.log("err", err);
  });
```

#### update
Update a project.
```js
deepgram.projects
  .update(
    { project_id: "84b227ad-dfac-4096-82f6-f7397006050b" },
    {
      name: "A new name",
    }
  )
  .then((response) => {
    console.log("list", response);
  })
  .catch((err) => {
    console.log("err", err);
  });
```

#### delete
Delete a project.
```js
deepgram.projects
  .delete("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((response) => {
    console.log("delete", response);
  })
  .catch((err) => {
    console.log("err", err);
  });
```

### Members

#### listMembers
Retrieves account objects for all of the accounts in the specified project.
```js
deepgram.members
  .listMembers("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((response) => {
    console.log("Members: ", response);
  })
  .catch((err) => {
    console.log("Members ERROR: ", err);
  });
```

#### deleteMembers
Removes member account for specified member_id.
```js
 deepgram.members
  .removeMember(
    "84b227ad-dfac-4096-82f6-f7397006050b",
    "f12cc224-282b-4de4-90f1-651d5fdf04f1"
  )
  .then((response) => {
    console.log("Member DELETED: ", response);
  })
  .catch((err) => {
    console.log("Member DELETED ERROR: ", err);
  });
```

### Keys
#### list
Retrieves all keys associated with the provided project_id.
```js
deepgram.keys
  .list("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((res) => {
    console.log({ res });
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### get
Retrieves a specific key associated with the provided project_id.
```js
deepgram.keys
  .get(
    "84b227ad-dfac-4096-82f6-f7397006050b",
    "f12cc224-282b-4de4-90f1-651d5fdf04f1"
    )
  .then((res) => {
    console.log({ res });
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### create
Creates an API key with the provided scopes.
```js
deepgram.keys
  .create(
    "84b227ad-dfac-4096-82f6-f7397006050b",
     "Temporary key",
    ["usage"],
    {
      timeToLive: 5000,
    }
  )
  .then((res) => {
    console.log({ res });
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### delete
Deletes a specific key associated with the provided project_id.
```js
deepgram.keys
  .delete(
    "84b227ad-dfac-4096-82f6-f7397006050b",
    "f12cc224-282b-4de4-90f1-651d5fdf04f1"
  )
  .then((response) => {
    console.log("KEY DELTED: ", response);
  })
  .catch((err) => {
    console.log("KEY DELETED ERROR: ", err);
  });
```

### Invitations
#### list
Retrieves all invitations associated with the provided project_id.
```js
deepgram.invitations
  .list("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((res) => {
    console.log({ res });
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
```

#### send
Sends an invitation to the provided email address.
```js
deepgram.invitation
  .send("84b227ad-dfac-4096-82f6-f7397006050b", {
    email: "user@email.com",
    scope: "member",
  })
  .then((response) => {
    console.log("Invitation sent: ", response);
  })
  .catch((err) => {
    console.log("Invitation ERROR: ", err);
  });
```

#### leave
Removes the authenticated user from the project.
```js
deepgram.invitation
  .leave("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((response) => {
    console.log({response});
  })
  .catch((err) => {
    console.log("Invitation leave ERROR: ", err);
  });
```

#### delete
Removes the specified invitation from the project.
```js
deepgram.invitation
  .delete("84b227ad-dfac-4096-82f6-f7397006050b", "user@email.com")
  .then((response) => {
    console.log({response});
  })
  .catch((err) => {
    console.log("Invitation delete ERROR: ", err);
  });
```

### Billing
#### listBalances
Retrieves the list of balance info for the specified project.
```js
deepgram.billing
  .listBalances("84b227ad-dfac-4096-82f6-f7397006050b")
  .then((response) => {
    console.log({response});
  })
  .catch((err) => {
    console.log("Billing listBalances ERROR: ", err);
  });
```

#### getBalance
Retrieves the balance info for the specified project and balance_id.
```js
deepgram.billing
  .getBalance("84b227ad-dfac-4096-82f6-f7397006050b", "21b98377-657e-471a-b75e-299fb99ec2c3")
  .then((response) => {
    console.log({response});
  })
  .catch((err) => {
    console.log("Billing getBalance ERROR: ", err);
  });
```

## Samples

To run the sample code, first run the following in your terminal:

```bash
npm install
npm build
```

Then update the config object located at the top of the `index.js`
file in the sample folder.

```js
const config = {
  deepgramApiKey: "YOUR_DEEPGRAM_API_KEY",
  urlToFile:
    "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav",
};
```

Finally, run the sample code using the following command in your terminal:

```bash
node sample/index.js
```

The sample demonstrates the following uses:

- Transcribing a prerecorded file
- Retrieving usage for a project
- Getting a project
- Creating an API key
- Deleting an API key

## Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue](https://github.com/deepgram/node-sdk/issues/new) on this repository
- Tweet at us! We're [@DeepgramAI on Twitter](https://twitter.com/DeepgramAI)

## Further Reading

Check out the Developer Documentation at [https://developers.deepgram.com/](https://developers.deepgram.com/)

[signup]: https://console.deepgram.com/signup?utm_medium=github&utm_source=DEVREL&utm_content=node-sdk
[license]: LICENSE.txt
