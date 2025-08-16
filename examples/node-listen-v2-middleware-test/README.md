# v2 Middleware Test on v1 Endpoint

This example demonstrates that v2 middleware functionality works regardless of the actual API endpoint version. It uses a v2 client (with middleware capabilities) but connects to the v1 endpoint.

## What This Tests

1. **Global Middleware**: Registered via `ListenV2.use()` affects all v2 sessions
2. **Instance Middleware**: Added via `connection.use()` affects only that connection
3. **Before/After Hooks**: Middleware runs before and after user event handlers
4. **Cross-Version Compatibility**: v2 features work with v1 endpoints
5. **Turn Counting**: Enhanced session supervision works on v1 API
6. **Event Forwarding**: All original events pass through unchanged

## Key Features Demonstrated

### Global Middleware

```javascript
ListenV2.use({
  event: "Results",
  before: (payload, ctx) => {
    console.log("Before:", payload.channel?.alternatives?.[0]?.transcript);
    payload._middleware_timestamp = Date.now();
  },
  after: (payload, ctx) => {
    const processingTime = Date.now() - payload._middleware_timestamp;
    console.log("After: Processing took", processingTime + "ms");
  },
});
```

### Instance Middleware

```javascript
connection.use({
  event: "Results",
  before: (payload) => {
    payload._instance_marker = "processed-by-instance";
  },
  after: (payload) => {
    console.log("Instance marker:", payload._instance_marker);
  },
});
```

### v2 Client on v1 Endpoint

```javascript
// v2 client gets middleware + supervision
const connection = deepgram.v("v2").listen.live(
  { model: "nova-3" },
  "v1/listen" // But connects to v1 endpoint
);
```

## Expected Output

The example will show middleware execution in this order:

1. **Global before middleware** - Logs transcript and adds timestamp
2. **Instance before middleware** - Adds instance marker
3. **User event handler** - Your normal transcript processing
4. **Instance after middleware** - Logs instance marker
5. **Global after middleware** - Logs processing time

## Running

```bash
# Load environment variables
cat ../../.env | grep -v '^#' | xargs -I {} echo 'export {}' > /tmp/env_vars.sh
source /tmp/env_vars.sh

# Run the test
npm start
```

## Architecture Insight

This demonstrates that our SDK architecture successfully separates:

- **Transport Layer** (v1/v2 API endpoints) - in core
- **Enhancement Layer** (middleware, supervision) - in SDK

The middleware system works at the SDK level regardless of which underlying API version is used, proving the architecture is sound and flexible.
