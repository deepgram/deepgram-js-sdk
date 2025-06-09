const { writeFile, appendFile } = require("fs/promises");
const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
const { join } = require("path");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Add WAV header generation function
function createWavHeader(audioData, sampleRate = 16000, channels = 1, bitsPerSample = 16) {
  const dataLength = audioData.length;
  const headerLength = 44;
  const fileLength = dataLength + headerLength - 8;

  const header = Buffer.alloc(headerLength);

  // RIFF header
  header.write("RIFF", 0);
  header.writeUInt32LE(fileLength, 4);
  header.write("WAVE", 8);

  // fmt chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // audio format (PCM)
  header.writeUInt16LE(channels, 22); // channels
  header.writeUInt32LE(sampleRate, 24); // sample rate
  header.writeUInt32LE((sampleRate * channels * bitsPerSample) / 8, 28); // byte rate
  header.writeUInt16LE((channels * bitsPerSample) / 8, 32); // block align
  header.writeUInt16LE(bitsPerSample, 34); // bits per sample

  // data chunk
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

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
          sample_rate: 24000,
        },
        output: {
          encoding: "linear16",
          sample_rate: 16000,
          container: "wav",
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
            type: "deepgram",
            model: "aura-2-thalia-en",
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

    // Create WAV header and combine with audio data
    if (audioBuffer.length > 0) {
      const wavHeader = createWavHeader(audioBuffer);
      const wavFile = Buffer.concat([wavHeader, audioBuffer]);
      await writeFile(join(__dirname, `output-${i}.wav`), wavFile);
      console.log(`Wrote ${wavFile.length} bytes to output-${i}.wav`);
    } else {
      console.log("No audio data to write");
    }

    audioBuffer = Buffer.alloc(0);
    i++;
  });

  connection.on(AgentEvents.Unhandled, (data) => {
    console.dir(data, { depth: null });
  });
};

void agent();
