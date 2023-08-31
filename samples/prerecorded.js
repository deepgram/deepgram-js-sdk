const { createClient } = require("../dist/main/index");
const fs = require("fs");

const url = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log("URL source success.");
};

const readstream = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { error } = await deepgram.listen.prerecorded.transcribeFile(
    {
      stream: fs.createReadStream("./samples/nasa.mp4"),
      mimetype: "audio/mp4",
    },
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log("ReadStream source success.");
};

const buffer = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { error } = await deepgram.listen.prerecorded.transcribeFile(
    {
      buffer: fs.readFileSync("./samples/nasa.mp4"),
      mimetype: "audio/mp4",
    },
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log("Buffer source success.");
};

url();
readstream();
buffer();
