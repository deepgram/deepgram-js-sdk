/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTranscriptionEvents } = require("../../packages/core/dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

const live = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const connection = deepgram.listen.live({
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
