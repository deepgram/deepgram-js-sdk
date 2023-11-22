const { createClient } = require("../../dist/main/index");
const fs = require("fs");

const transcribeUrl = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova",
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
};

const transcribeFile = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync("./examples/nasa.mp4"),
    {
      model: "nova",
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
};

transcribeUrl();
transcribeFile();
