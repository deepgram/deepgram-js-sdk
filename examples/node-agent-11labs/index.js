const { writeFile, appendFile } = require("fs/promises");
const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
const { join } = require("path");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const agent = async () => {
  let audioBuffer = Buffer.from([
    0x52,
    0x49,
    0x46,
    0x46, // "RIFF"
    0x00,
    0x00,
    0x00,
    0x00, // Placeholder for file size
    0x57,
    0x41,
    0x56,
    0x45, // "WAVE"
    0x66,
    0x6d,
    0x74,
    0x20, // "fmt "
    0x10,
    0x00,
    0x00,
    0x00, // Chunk size (16)
    0x01,
    0x00, // Audio format (1 for PCM)
    0x01,
    0x00, // Number of channels (1)
    0x80,
    0x3e,
    0x00,
    0x00, // Sample rate (16000)
    0x00,
    0x7d,
    0x00,
    0x00, // Byte rate (16000 * 2)
    0x02,
    0x00, // Block align (2)
    0x10,
    0x00, // Bits per sample (16)
    0x64,
    0x61,
    0x74,
    0x61, // "data"
    0x00,
    0x00,
    0x00,
    0x00, // Placeholder for data size
  ]);
  let i = 0;
  const url = "https://dpgr.am/spacewalk.wav";
  const connection = deepgram.agent();
  connection.on(AgentEvents.Welcome, () => {
    console.log("Welcome to the Deepgram Voice Agent!");

    connection.configure({
      audio: {
        input: {
          encoding: "linear16",
          sample_rate: 24000,
        },
        output: {
          encoding: "linear16",
          sample_rate: 16000,
        },
      },
      agent: {
        language: "en",
        listen: {
          provider: {
            type: "deepgram",
            model: "nova-3",
          },
        },
        think: {
          provider: {
            type: "open_ai",
            model: "gpt-4o-mini",
          },
          prompt: "You are a friendly AI assistant.",
        },
        speak: {
          provider: {
            type: "eleven_labs",
            model_id: "eleven_multilingual_v2",
          },
          endpoint: {
            url: "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream",
            headers: {
              "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
            },
          },
        },
        greeting: "Hello! How can I help you today?",
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
      audioBuffer = Buffer.from([
        0x52,
        0x49,
        0x46,
        0x46, // "RIFF"
        0x00,
        0x00,
        0x00,
        0x00, // Placeholder for file size
        0x57,
        0x41,
        0x56,
        0x45, // "WAVE"
        0x66,
        0x6d,
        0x74,
        0x20, // "fmt "
        0x10,
        0x00,
        0x00,
        0x00, // Chunk size (16)
        0x01,
        0x00, // Audio format (1 for PCM)
        0x01,
        0x00, // Number of channels (1)
        0x80,
        0x3e,
        0x00,
        0x00, // Sample rate (16000)
        0x00,
        0x7d,
        0x00,
        0x00, // Byte rate (16000 * 2)
        0x02,
        0x00, // Block align (2)
        0x10,
        0x00, // Bits per sample (16)
        0x64,
        0x61,
        0x74,
        0x61, // "data"
        0x00,
        0x00,
        0x00,
        0x00, // Placeholder for data size
      ]); // add custom wav headers because 11 labs cannot containerise
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
    // add custom wav headers because 11 labs cannot containerise
    audioBuffer = Buffer.from([
      0x52,
      0x49,
      0x46,
      0x46, // "RIFF"
      0x00,
      0x00,
      0x00,
      0x00, // Placeholder for file size
      0x57,
      0x41,
      0x56,
      0x45, // "WAVE"
      0x66,
      0x6d,
      0x74,
      0x20, // "fmt "
      0x10,
      0x00,
      0x00,
      0x00, // Chunk size (16)
      0x01,
      0x00, // Audio format (1 for PCM)
      0x01,
      0x00, // Number of channels (1)
      0x80,
      0x3e,
      0x00,
      0x00, // Sample rate (16000)
      0x00,
      0x7d,
      0x00,
      0x00, // Byte rate (16000 * 2)
      0x02,
      0x00, // Block align (2)
      0x10,
      0x00, // Bits per sample (16)
      0x64,
      0x61,
      0x74,
      0x61, // "data"
      0x00,
      0x00,
      0x00,
      0x00, // Placeholder for data size
    ]);
    i++;
  });

  connection.on(AgentEvents.Unhandled, (data) => {
    console.dir(data, { depth: null });
  });
};

void agent();
