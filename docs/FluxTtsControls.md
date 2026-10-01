# Flux TTS Controls

Flux TTS v2 supports speed, inline pauses, and inline pronunciation controls in English. This guide describes the JavaScript SDK surface and the transport-specific rules.

## Batch REST

Use `client.speak.v2.audio.generate()` when the complete text is available. Set `speed` on the request. The accepted range is `0.5` through `1.5` in `0.05` increments.

```typescript
const response = await client.speak.v2.audio.generate({
  model: "flux-alexis-en",
  speed: 1.1,
  text: "Your account update is ready.",
});
```

Batch requests support inline pauses. A pause is `500` through `3000` milliseconds, in `100` millisecond increments, with at most eight pauses per request.

```typescript
const response = await client.speak.v2.audio.generate({
  model: "flux-alexis-en",
  text: "First sentence.\\{pause:500ms\\} Second sentence.",
});
```

Inline pronunciation controls are Early Access. Use a JSON control in the text with the word to replace and its IPA pronunciation.

```typescript
const response = await client.speak.v2.audio.generate({
  model: "flux-alexis-en",
  text: 'Welcome to \\{"word":"Deepgram","pronounce":"ˈdiːp.ɡræm"\\}.',
});
```

Do not combine pronunciation with a pause or with a speed other than `1.0`; the service rejects the request with `CONTROL_COMBINATION_INVALID`. A request with a pause cannot set speed above `1.15` (`PAUSE_SPEED_CAP_EXCEEDED`).

## Streaming WebSocket

Create a Flux TTS socket with `client.speak.v2.createConnection()`. Set the initial speed in the connection arguments, or change it later with `sendConfigure()`.

```typescript
const socket = await client.speak.v2.createConnection({
  model: "flux-alexis-en",
  speed: 1.1,
});

socket.connect();
await socket.waitForOpen();
socket.sendConfigure({ type: "Configure", speed: 1.0 });
```

WebSocket turns support Early Access pronunciation controls but not pause controls. Sending `\{pause:...\}` over the socket closes the connection with an `Error` message whose code is `DATA-0002`. A pronunciation control when the active socket speed is not `1.0` also closes the connection with `DATA-0002`.

Do not change speed while a buffered turn contains a pronunciation control. The socket returns `ConfigureFailure` with code `CONTROL_COMBINATION_INVALID`; flush that turn first. A pronunciation control in the active turn does not block a later speed change.

Handle `Warning` and `SpeechMetadata` messages for per-turn control results. `controls_applied.pronunciations_applied` and `pronunciation_warnings` report pronunciation processing. `controls_applied.breaks_applied` is always `0` on WebSocket metadata because pauses are batch-only.

```typescript
socket.on("message", (message) => {
  if (message.type === "ConfigureFailure" && message.code === "CONTROL_COMBINATION_INVALID") {
    console.error("Flush the buffered pronunciation turn before changing speed.");
  }
  if (message.type === "Error" && message.code === "DATA-0002") {
    console.error("The WebSocket controls are invalid; this connection is closed.");
  }
});
```
