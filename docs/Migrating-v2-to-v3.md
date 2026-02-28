# v2 to v3+ Migration Guide

This guide helps you migrate from Deepgram Node SDK v2 to the Deepgram JavaScript SDK v3+ (versions 3.0.0 and above). The v3+ release introduces significant improvements including isomorphic JavaScript/Node.js support, better error handling, scoped configuration, and support for future products.

## Table of Contents

- [Installation](#installation)
- [Configuration Changes](#configuration-changes)
- [API Method Changes](#api-method-changes)
  - [Listen V1](#listen-v1)
  - [Manage V1](#manage-v1)
  - [Self-Hosted V1](#self-hosted-v1)
- [Breaking Changes Summary](#breaking-changes-summary)

## Installation

```bash
npm install @deepgram/sdk
```

## Configuration Changes

### v2 Client Initialization

```typescript
import { Deepgram } from "@deepgram/sdk";

const deepgram = new Deepgram(DEEPGRAM_API_KEY);
```

### v3+ Client Initialization

```typescript
import { createClient } from "@deepgram/sdk";

const deepgram = createClient(DEEPGRAM_API_KEY);

// With scoped configuration
const deepgram = createClient(DEEPGRAM_API_KEY, {
  global: { url: "http://localhost:8080" },
});
```

## API Method Changes

### Listen V1

#### Transcribe File

**v2**

```typescript
import fs from "fs";

const response = await deepgram.transcription.preRecorded(
  {
    stream: fs.createReadStream("./examples/spacewalk.wav"),
    mimetype: MIMETYPE_OF_FILE,
  },
  {
    model: "nova-3",
  }
);
```

**v3+**

```typescript
import fs from "fs";

const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
  fs.createReadStream("./examples/spacewalk.wav"),
  {
    model: "nova-3",
  }
);
```

#### Transcribe URL

**v2**

```typescript
const response = await deepgram.transcription.preRecorded(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  {
    model: "nova-3",
  }
);
```

**v3+**

```typescript
const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  {
    model: "nova-3",
  }
);
```

#### Transcribe File with Callback

**v2**

```typescript
import fs from "fs";

const response = await deepgram.transcription.preRecorded(
  {
    stream: fs.createReadStream("./examples/spacewalk.wav"),
    mimetype: MIMETYPE_OF_FILE,
  },
  {
    model: "nova-3",
    callback: "http://callback/endpoint",
  }
);
```

**v3+**

```typescript
import { createClient, CallbackUrl } from "@deepgram/sdk";
import fs from "fs";

const { result, error } =
  await deepgram.listen.prerecorded.transcribeFileCallback(
    fs.createReadStream("./examples/spacewalk.wav"),
    new CallbackUrl("http://callback/endpoint"),
    {
      model: "nova-3",
    }
  );
```

#### Transcribe URL with Callback

**v2**

```typescript
const response = await deepgram.transcription.preRecorded(
  {
    url: "https://dpgr.am/spacewalk.wav",
  },
  {
    model: "nova-3",
    callback: "http://callback/endpoint",
  }
);
```

**v3+**

```typescript
import { createClient, CallbackUrl } from "@deepgram/sdk";

const { result, error } =
  await deepgram.listen.prerecorded.transcribeUrlCallback(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    new CallbackUrl("http://callback/endpoint"),
    {
      model: "nova-3",
    }
  );
```

#### WebSocket Streaming (Listen V1)

**v2**

```typescript
const dgConnection = await deepgram.transcription.live({
  model: "nova-3",
});

source.addListener("got-some-audio", async (event) => {
  dgConnection.send(event.raw_audio_data);
});

dgConnection.addListener("transcriptReceived", (transcription) => {
  console.log(transcription.data);
});
```

**v3+**

```typescript
import { LiveTranscriptionEvents } from "@deepgram/sdk";

const dgConnection = deepgram.listen.live({ model: "nova-3" });

dgConnection.on(LiveTranscriptionEvents.Open, () => {
  dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log(data);
  });

  source.addListener("got-some-audio", async (event) => {
    dgConnection.send(event.raw_audio_data);
  });
});
```

### Manage V1

#### Projects

**v2**

```typescript
// Get projects
const result = await deepgram.projects.list();

// Get project
const result = await deepgram.projects.get(projectId);

// Update project
const result = await deepgram.projects.update(projectId, options);

// Delete project
await deepgram.projects.delete(projectId);
```

**v3+**

```typescript
// Get projects
const { result, error } = await deepgram.manage.getProjects();

// Get project
const { result, error } = await deepgram.manage.getProject(projectId);

// Update project
const { result, error } = await deepgram.manage.updateProject(
  projectId,
  options
);

// Delete project
const { error } = await deepgram.manage.deleteProject(projectId);
```

#### Keys

**v2**

```typescript
// List keys
const result = await deepgram.keys.list(projectId);

// Get key
const result = await deepgram.keys.get(projectId, projectKeyId);

// Create key
const result = await deepgram.keys.create(
  projectId,
  comment,
  scopes,
  options
);

// Delete key
await deepgram.keys.delete(projectId, projectKeyId);
```

**v3+**

```typescript
// List keys
const { result, error } = await deepgram.manage.getProjectKeys(projectId);

// Get key
const { result, error } = await deepgram.manage.getProjectKey(
  projectId,
  projectKeyId
);

// Create key
const { result, error } = await deepgram.manage.createProjectKey(
  projectId,
  options
);

// Delete key
const { error } = await deepgram.manage.deleteProjectKey(
  projectId,
  projectKeyId
);
```

#### Members

**v2**

```typescript
// Get members
const result = await deepgram.members.listMembers(projectId);

// Remove member
const result = await deepgram.members.removeMember(projectId, projectMemberId);
```

**v3+**

```typescript
// Get members
const { result, error } = await deepgram.manage.getProjectMembers(projectId);

// Remove member
const { error } = await deepgram.manage.removeProjectMember(
  projectId,
  projectMemberId
);
```

#### Scopes

**v2**

```typescript
// Get scopes
const result = await deepgram.scopes.get(projectId, projectMemberId);

// Update scope
const result = await deepgram.scopes.update(
  projectId,
  projectMemberId,
  scope
);
```

**v3+**

```typescript
// Get scopes
const { result, error } = await deepgram.manage.getProjectMemberScopes(
  projectId,
  projectMemberId
);

// Update scope
const { result, error } = await deepgram.manage.updateProjectMemberScope(
  projectId,
  projectMemberId,
  options
);
```

#### Invitations

**v2**

```typescript
// List invites
const result = await deepgram.invitation.list(projectId);

// Send invite
const result = await deepgram.invitation.send(projectId, options);

// Delete invite
const result = await deepgram.invitation.delete(projectId, email);

// Leave project
const result = await deepgram.invitation.leave(projectId);
```

**v3+**

```typescript
// List invites
const { result, error } = await deepgram.manage.getProjectInvites(projectId);

// Send invite
const { result, error } = await deepgram.manage.sendProjectInvite(
  projectId,
  options
);

// Delete invite
const { error } = await deepgram.manage.deleteProjectInvite(projectId, email);

// Leave project
const { result, error } = await deepgram.manage.leaveProject(projectId);
```

#### Usage

**v2**

```typescript
// Get all requests
const result = await deepgram.usage.listRequests(projectId, options);

// Get request
const result = await deepgram.usage.getRequest(projectId, requestId);

// Get usage summary
const result = await deepgram.usage.getUsage(projectId, options);

// Get usage fields
const result = await deepgram.usage.getFields(projectId, options);
```

**v3+**

```typescript
// Get all requests
const { result, error } = await deepgram.manage.getProjectUsageRequests(
  projectId,
  options
);

// Get request
const { result, error } = await deepgram.manage.getProjectUsageRequest(
  projectId,
  requestId
);

// Get usage summary
const { result, error } = await deepgram.manage.getProjectUsageSummary(
  projectId,
  options
);

// Get usage fields
const { result, error } = await deepgram.manage.getProjectUsageFields(
  projectId,
  options
);
```

#### Billing

**v2**

```typescript
// Get all balances
const result = await deepgram.billing.listBalances(projectId);

// Get balance
const result = await deepgram.billing.getBalance(projectId, balanceId);
```

**v3+**

```typescript
// Get all balances
const { result, error } = await deepgram.manage.getProjectBalances(projectId);

// Get balance
const { result, error } = await deepgram.manage.getProjectBalance(
  projectId,
  balanceId
);
```

### Self-Hosted V1

#### Distribution Credentials

**v2**

```
Not available in v2.
```

**v3+**

```typescript
// List credentials
const { result, error } = await deepgram.onprem.listCredentials(projectId);

// Get credentials
const { result, error } = await deepgram.onprem.getCredentials(
  projectId,
  credentialId
);

// Create credentials
const { result, error } = await deepgram.onprem.createCredentials(
  projectId,
  options
);

// Delete credentials
const { result, error } = await deepgram.onprem.deleteCredentials(
  projectId,
  credentialId
);
```

## Breaking Changes Summary

### Major Changes

1. **SDK Structure**: Renamed from Node SDK to JavaScript SDK with isomorphic support
2. **Client Initialization**: New `createClient()` function replaces `new Deepgram()` class
3. **Module Support**: ESM and UMD support added for browser usage
4. **API Structure**: Namespaced API structure (`listen.prerecorded`, `manage`)
5. **Callback Methods**: Separated into dedicated `*Callback` methods
6. **WebSocket Implementation**: New event system using `LiveTranscriptionEvents` enum
7. **Error Handling**: New `{ result, error }` destructuring pattern
8. **HTTP Client**: Switched from `request` to `fetch`

### Removed Features

- Old `Deepgram` class (replaced with `createClient` function)
- Direct `transcription.preRecorded()` method (split into `transcribeFile`, `transcribeUrl`)
- Old `addListener` / `transcriptReceived` event system (replaced with `on` / `LiveTranscriptionEvents`)
- Old management API namespaces (`projects`, `keys`, `members`, `scopes`, `invitation`, `usage`, `billing`)

### New Features in v3+

- **Isomorphic Support**: Works in both Node.js and browsers
- **ESM/UMD Modules**: CDN support for browser usage
- **Scoped Configuration**: Configure SDK aspects from initialization
- **Self-Hosted APIs**: New on-premise deployment support
- **Better Error Handling**: Structured `{ result, error }` return pattern
- **Captions Package**: WebVTT and SRT captions available as standalone package ([deepgram-js-captions](https://github.com/deepgram/deepgram-js-captions))

### Migration Checklist

- [ ] Update to latest version: `npm install @deepgram/sdk`
- [ ] Replace `new Deepgram()` with `createClient()`
- [ ] Update import from `Deepgram` to `createClient`
- [ ] Update `transcription.preRecorded()` calls to `listen.prerecorded.transcribeFile()` or `listen.prerecorded.transcribeUrl()`
- [ ] Move callback-based transcriptions to dedicated `*Callback` methods using `CallbackUrl`
- [ ] Update WebSocket event handling to use `LiveTranscriptionEvents` enum
- [ ] Update management API calls from direct namespaces to `manage.*`
- [ ] Add `{ result, error }` destructuring to all API responses
- [ ] Remove `mimetype` from file transcription calls
- [ ] Test all functionality with new API structure

### Notes

- WebVTT and SRT captions are now available as a standalone package: [deepgram-js-captions](https://github.com/deepgram/deepgram-js-captions)
- Self-hosted API functionality is new in v3+
