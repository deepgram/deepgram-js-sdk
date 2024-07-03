const { createClient, LiveTTSEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");

const live = async () => {
  const text = "Hello, how can I help you today?";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY, {
    global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } },
  });

  const connection = deepgram.speak.live({ text }, { model: "aura-asteria-en" });

  connection.on(LiveTTSEvents.Open, () => {
    connection.on(LiveTTSEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTTSEvents.Metadata, (data) => {
      console.log(`Deepgram Metadata: ${data}`);
    });

    connection.on(LiveTTSEvents.Audio, (data) => {
      console.log(`Deepgram Audio: ${data}`);
    });

    connection.on(LiveTTSEvents.Flushed, (data) => {
      console.log("Deepgram Flushed");
    });

    connection.on(LiveTTSEvents.Error, (err) => {
      console.error(err);
    });

    fetch(url)
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          connection.send(res.read());
        });
      });
  });
};

live();
