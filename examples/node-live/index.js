const {
  createClient,
  LiveTranscriptionEvents,
  LiveTranscriptionEvent,
} = require("../../dist/main/index");
const fetch = require("cross-fetch");

const live = async () => {
  const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const connection = deepgram.listen.live({
    model: "nova-2",
    utterance_end_ms: 1500,
    interim_results: true,
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log(data.channel);
    });

    connection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.SpeechStarted, (data) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.Error, (err) => {
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
