# Enhanced Listen v2 Example

This example demonstrates the new enhanced SDK features for Listen v2:

## Features Demonstrated

1. **Automatic v2 Supervision**: When connecting to v2 endpoints, the SDK automatically adds:

   - Turn counting for conversational flows
   - Automatic reconnection with exponential backoff
   - Session context preservation

2. **Global Middleware**: Register middleware that applies to all Listen v2 sessions:

   ```javascript
   ListenV2.use({
     event: "Results",
     before: (payload) => {
       /* modify before user handlers */
     },
     after: (payload) => {
       /* run after user handlers */
     },
   });
   ```

3. **Instance Middleware**: Add middleware specific to a connection:

   ```javascript
   connection.use({
     event: "SpeechStarted",
     before: () => console.log("User started speaking"),
   });
   ```

4. **Enhanced Events**: New events for better session management:
   - `turn_started`: When a conversational turn begins
   - `reconnecting`: When attempting to reconnect
   - `reconnected`: When successfully reconnected
   - `reconnect_failed`: When reconnection fails

## Running

```bash
# Set your API key
export DEEPGRAM_API_KEY="your-api-key"

# Run the example
npm start
```

## Comparison with v1

- **v1 Listen**: `deepgram.listen.live()` - Basic connection, no supervision
- **v2 Listen**: `deepgram.v('v2').listen.live()` - Enhanced with turn counting, reconnection, middleware

The v2 endpoint provides the same API but with enhanced reliability and observability features.
