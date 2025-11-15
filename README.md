# Deepgram TypeScript SDK

![Built with Fern](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)
[![NPM version](https://img.shields.io/npm/v/@deepgram/sdk)](https://www.npmjs.com/package/@deepgram/sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

The official TypeScript SDK for Deepgram's automated speech recognition, text-to-speech, and language understanding APIs. Power your applications with world-class speech and Language AI models.

## Documentation

Comprehensive API documentation and guides are available at [developers.deepgram.com](https://developers.deepgram.com).

### Migrating From Earlier Versions

- [v2 to v3+](./docs/Migrating-v2-to-v3.md)
- [v3+ to v5](./docs/Migrating-v3-to-v5.md) (current)

## Installation

Install the Deepgram TypeScript SDK using npm:

```sh
npm i -s @deepgram/sdk
```

## Reference

- **[API Reference](./reference.md)** - Complete reference for all SDK methods and parameters
- **[WebSocket Reference](./websockets-reference.md)** - Detailed documentation for real-time WebSocket connections

## Usage

Instantiate and use the client with the following:

```typescript
import { createReadStream } from "fs";
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({ apiKey: "YOUR_API_KEY" });
await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), {});
```

## Authentication

The Deepgram SDK supports two authentication methods:

<!--
### Access Token Authentication

Use access tokens for temporary or scoped access (recommended for client-side applications):

```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Explicit access token
const client = new DeepgramClient({ accessToken: "YOUR_ACCESS_TOKEN" });

// Or via environment variable DEEPGRAM_TOKEN
const client = new DeepgramClient();

// Generate access tokens using your API key
const authClient = new DeepgramClient({ apiKey: "YOUR_API_KEY" });
const tokenResponse = await authClient.auth.v1.tokens.grant();
const tokenClient = new DeepgramClient({ accessToken: tokenResponse.accessToken });
```
-->

### API Key Authentication

Use your Deepgram API key for server-side applications:

```typescript
import { DeepgramClient } from "@deepgram/sdk";

// Explicit API key
const client = new DeepgramClient({ apiKey: "YOUR_API_KEY" });

// Or via environment variable DEEPGRAM_API_KEY
const client = new DeepgramClient();
```

### Environment Variables

The SDK automatically discovers credentials from these environment variables:

<!-- - `DEEPGRAM_TOKEN` - Your access token (takes precedence) -->

- `DEEPGRAM_API_KEY` - Your Deepgram API key

**Precedence:** Explicit parameters > Environment variables

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Deepgram } from "@deepgram/sdk";

const request: Deepgram.GrantV1Request = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { DeepgramError } from "@deepgram/sdk";

try {
    await client.listen.v1.media.transcribeFile(...);
} catch (err) {
    if (err instanceof DeepgramError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## File Uploads

You can upload files using the client:

```typescript
import { createReadStream } from "fs";

await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), ...);
await client.listen.v1.media.transcribeFile(new ReadableStream(), ...);
await client.listen.v1.media.transcribeFile(Buffer.from('binary data'), ...);
await client.listen.v1.media.transcribeFile(new Blob(['binary data'], { type: 'audio/mpeg' }), ...);
await client.listen.v1.media.transcribeFile(new File(['binary data'], 'file.mp3'), ...);
await client.listen.v1.media.transcribeFile(new ArrayBuffer(8), ...);
await client.listen.v1.media.transcribeFile(new Uint8Array([0, 1, 2]), ...);
```

The client accepts a variety of types for file upload parameters:

- Stream types: `fs.ReadStream`, `stream.Readable`, and `ReadableStream`
- Buffered types: `Buffer`, `Blob`, `File`, `ArrayBuffer`, `ArrayBufferView`, and `Uint8Array`

### Metadata

You can configure metadata when uploading a file:

```typescript
const file: Uploadable.WithMetadata = {
    data: createReadStream("path/to/file"),
    filename: "my-file", // optional
    contentType: "audio/mpeg", // optional
    contentLength: 1949, // optional
};
```

Alternatively, you can upload a file directly from a file path:

```typescript
const file: Uploadable.FromPath = {
    path: "path/to/file",
    filename: "my-file", // optional
    contentType: "audio/mpeg", // optional
    contentLength: 1949, // optional
};
```

The metadata is used to set the `Content-Length`, `Content-Type`, and `Content-Disposition` headers. If not provided, the client will attempt to determine them automatically.
For example, `fs.ReadStream` has a `path` property which the SDK uses to retrieve the file size from the filesystem without loading it into memory.

## Binary Response

You can consume binary data from endpoints using the `BinaryResponse` type which lets you choose how to consume the data:

```typescript
const response = await client.speak.v1.audio.generate(...);
const stream: ReadableStream<Uint8Array> = response.stream();
// const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
// const blob: Blob = response.blob();
// const bytes: Uint8Array = response.bytes();
// You can only use the response body once, so you must choose one of the above methods.
// If you want to check if the response body has been used, you can use the following property.
const bodyUsed = response.bodyUsed;
```

<details>
<summary>Save binary response to a file</summary>

<blockquote>
<details>
<summary>Node.js</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const nodeStream = Readable.fromWeb(stream);
const writeStream = createWriteStream('path/to/file');

await pipeline(nodeStream, writeStream);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await writeFile('path/to/file', Buffer.from(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const arrayBuffer = await blob.arrayBuffer();
await writeFile('output.bin', Buffer.from(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
import { writeFile } from 'fs/promises';

const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await writeFile('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Bun</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
await Bun.write('path/to/file', stream);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await Bun.write('path/to/file', arrayBuffer);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
await Bun.write('path/to/file', blob);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await Bun.write('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Deno</summary>

<blockquote>
<details>
<summary>ReadableStream (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const file = await Deno.open('path/to/file', { write: true, create: true });
await stream.pipeTo(file.writable);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
await Deno.writeFile('path/to/file', new Uint8Array(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const arrayBuffer = await blob.arrayBuffer();
await Deno.writeFile('path/to/file', new Uint8Array(arrayBuffer));
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
await Deno.writeFile('path/to/file', bytes);
```

</details>
</blockquote>

</details>
</blockquote>

<blockquote>
<details>
<summary>Browser</summary>

<blockquote>
<details>
<summary>Blob (most-efficient)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ReadableStream</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const reader = stream.getReader();
const chunks = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunks.push(value);
}

const blob = new Blob(chunks);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
const blob = new Blob([arrayBuffer]);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
const blob = new Blob([bytes]);
const url = URL.createObjectURL(blob);

// trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'filename';
a.click();
URL.revokeObjectURL(url);
```

</details>
</blockquote>

</details>
</blockquote>

</details>
</blockquote>

<details>
<summary>Convert binary response to text</summary>

<blockquote>
<details>
<summary>ReadableStream</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const stream = response.stream();
const text = await new Response(stream).text();
```

</details>
</blockquote>

<blockquote>
<details>
<summary>ArrayBuffer</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const arrayBuffer = await response.arrayBuffer();
const text = new TextDecoder().decode(arrayBuffer);
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Blob</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const blob = await response.blob();
const text = await blob.text();
```

</details>
</blockquote>

<blockquote>
<details>
<summary>Bytes (UIntArray8)</summary>

```ts
const response = await client.speak.v1.audio.generate(...);

const bytes = await response.bytes();
const text = new TextDecoder().decode(bytes);
```

</details>
</blockquote>

</details>

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    queryParams: {
        'customQueryParamKey': 'custom query param value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.listen.v1.media.transcribeFile(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.listen.v1.media.transcribeFile(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.listen.v1.media.transcribeFile(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Runtime Compatibility

The SDK works in the following runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { DeepgramClient } from "@deepgram/sdk";

const client = new DeepgramClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
