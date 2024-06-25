const { createClient } = require("../../dist/main/index");
const fs = require("fs");

const transcribeUrl = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  console.log("Transcribing URL", "https://dpgr.am/spacewalk.wav");
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova-2",
    }
  );

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

const transcribeFile = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const file = fs.readFileSync("./examples/spacewalk.wav");

  console.log("Transcribing file", file);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(file, {
    model: "nova-2",
  });

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

transcribeUrl();
transcribeFile();
