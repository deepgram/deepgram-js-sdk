const { createClient } = require("../../dist/main/index");
const { LiveTranscriptionEvents, LiveConnectionState } = require("../../dist/main/lib/enums");
const fetch = require("cross-fetch");

const live = async () => {
  const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const connection = deepgram.listen.live({ model: "general", tier: "enhanced" });

  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log(data);
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
