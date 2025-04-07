const { writeFile, appendFile } = require("fs/promises");
const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
const { join } = require("path");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const agent = async () => {
  let audioBuffer = Buffer.alloc(0);
  let i = 0;
  const url = "https://dpgr.am/spacewalk.wav";
  const connection = deepgram.agent();
  connection.on(AgentEvents.Welcome, () => {
    console.log("Welcome to the Deepgram Voice Agent!");

    connection.configure({
      audio: {
        input: {
          encoding: "linear16",
          sampleRate: 44100,
        },
        output: {
          encoding: "linear16",
          sampleRate: 16000,
          container: "wav",
        },
      },
      agent: {
        listen: {
          model: "nova-3",
          keyterms: ["spacewalk"],
        },
        speak: {
          model: "aura-2-thalia-en",
        },
        think: {
          provider: {
            type: "open_ai",
          },
          model: "gpt-4o-mini",
        },
      },
    });

    console.log("Deepgram agent configured!");

    setInterval(() => {
      console.log("Keep alive!");
      connection.keepAlive();
    }, 5000);

    fetch(url)
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          console.log("Sending audio chunk");
          connection.send(res.read());
        });
      });
  });

  connection.on(AgentEvents.Open, () => {
    console.log("Connection opened");
  });

  connection.on(AgentEvents.Close, () => {
    console.log("Connection closed");
    process.exit(0);
  });

  connection.on(AgentEvents.ConversationText, async (data) => {
    await appendFile(join(__dirname, `chatlog.txt`), JSON.stringify(data) + "\n");
  });

  connection.on(AgentEvents.UserStartedSpeaking, () => {
    if (audioBuffer.length) {
      console.log("Interrupting agent.");
      audioBuffer = Buffer.alloc(0);
    }
  });

  connection.on(AgentEvents.Metadata, (data) => {
    console.dir(data, { depth: null });
  });

  connection.on(AgentEvents.Audio, (data) => {
    console.log("Audio chunk received");
    // Concatenate the audio chunks into a single buffer
    const buffer = Buffer.from(data);
    audioBuffer = Buffer.concat([audioBuffer, buffer]);
  });

  connection.on(AgentEvents.Error, (err) => {
    console.error("Error!");
    console.error(JSON.stringify(err, null, 2));
    console.error(err.message);
  });

  connection.on(AgentEvents.AgentAudioDone, async () => {
    console.log("Agent audio done");
    await writeFile(join(__dirname, `output-${i}.wav`), audioBuffer);
    audioBuffer = Buffer.alloc(0);
    i++;
  });

  connection.on(AgentEvents.Unhandled, (data) => {
    console.dir(data, { depth: null });
  });
};

void agent();
