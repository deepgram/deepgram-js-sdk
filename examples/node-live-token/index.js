/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTranscriptionEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

const live = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // First, generate a temporary token with 60 second TTL
  console.log("🔍 Requesting token with ttl_seconds: 60");
  const { result: token, error } = await deepgram.auth.grantToken({
    ttl_seconds: 60,
  });

  if (error) {
    console.error("❌ Failed to generate token:", error);
    return;
  }

  // Log successful token generation
  console.log("✅ Token generated successfully!");
  console.log(`   • Expires in: ${token.expires_in} seconds`);
  console.log(`   • Token preview: ${token.access_token.substring(0, 20)}...`);
  console.log("");

  // Now, use the temporary token to create a new client
  // Note: Must use 'accessToken' property, not 'key'
  const deepgramWithToken = createClient({ accessToken: token.access_token });
  console.log("✅ Client created with temporary token - ready for live transcription!");
  const connection = deepgramWithToken.listen.live({
    model: "nova-3",
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened.");

    fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          connection.send(res.read());
        });
      });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log(data.channel.alternatives[0].transcript);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });
  });
};

live();
