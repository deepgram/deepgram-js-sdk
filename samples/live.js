const { createClient } = require("../dist/main/index");
const fetch = require("cross-fetch");

const live = async () => {
  const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

  const dgClient = createClient(process.env.DEEPGRAM_API_KEY);

  const deepgram = dgClient.transcription.live.listen({
    smart_format: true,
    interim_results: false,
    language: "en-US",
    model: "nova",
  });

  fetch(url)
    .then((r) => r.body)
    .then((res) => {
      res.on("readable", () => {
        if (deepgram.getReadyState() == 1) {
          deepgram.send(res.read());
        }
      });
    });

  deepgram.addListener("close", () => {
    console.log("Connection closed.");
  });

  deepgram.addListener("transcriptReceived", (message) => {
    const data = JSON.parse(message);

    console.log(data.channel, { depth: null });
  });

  setTimeout(() => {
    console.log("Live source success.");
    process.exit();
  }, 3000);
};

live();
