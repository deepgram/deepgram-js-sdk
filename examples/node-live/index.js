const { createClient, LiveTranscriptionEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");

const live = async () => {
  const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // We will collect the is_final=true messages here so we can use them when the person finishes speaking
  let is_finals = [];

  const connection = deepgram.listen.live({
    model: "nova-3",
    language: "en-US",
    // Apply smart formatting to the output
    smart_format: true,
    // To get UtteranceEnd, the following must be set:
    interim_results: true,
    utterance_end_ms: 1000,
    vad_events: true,
    // Time in milliseconds of silence to wait for before finalizing speech
    endpointing: 300,
    // Keyterm Prompting allows you improve Keyword Recall Rate (KRR) for important keyterms or phrases up to 90%.
    keyterm: ["BBC"],
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(`Deepgram Metadata: ${data}`);
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const sentence = data.channel.alternatives[0].transcript;

      // Ignore empty transcripts
      if (sentence.length == 0) {
        return;
      }
      if (data.is_final) {
        // We need to collect these and concatenate them together when we get a speech_final=true
        // See docs: https://developers.deepgram.com/docs/understand-endpointing-interim-results
        is_finals.push(sentence);

        // Speech final means we have detected sufficent silence to consider this end of speech
        // Speech final is the lowest latency result as it triggers as soon an the endpointing value has triggered
        if (data.speech_final) {
          const utterance = is_finals.join(" ");
          console.log(`Speech Final: ${utterance}`);
          is_finals = [];
        } else {
          // These are useful if you need real time captioning and update what the Interim Results produced
          console.log(`Is Final: ${sentence}`);
        }
      } else {
        // These are useful if you need real time captioning of what is being spoken
        console.log(`Interim Results: ${sentence}`);
      }
    });

    connection.on(LiveTranscriptionEvents.UtteranceEnd, (_data) => {
      const utterance = is_finals.join(" ");
      console.log(`Deepgram UtteranceEnd: ${utterance}`);
      is_finals = [];
    });

    connection.on(LiveTranscriptionEvents.SpeechStarted, (_data) => {
      // console.log("Deepgram SpeechStarted");
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
