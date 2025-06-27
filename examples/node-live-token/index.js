/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTranscriptionEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

const live = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // First, generate a temporary token
  const { result: token, error } = await deepgram.auth.grantToken(
    {
      comment: "temporary token for live transcription example",
      scopes: ["usage:write"],
      time_to_live_in_seconds: 60,
    },
    {
      // Optional: you can set a custom time-to-live for the token
    }
  );

  if (error) {
    console.error(error);
    return;
  }

  // Now, use the temporary token to create a new client
  const deepgramWithToken = createClient(token.key);
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
