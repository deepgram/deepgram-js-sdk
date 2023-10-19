const { createClient } = require("../../dist/main/index");
const fs = require("fs");

const url = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log(result);
};

const readstream = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.createReadStream("./examples/nasa.mp4"),
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log(result);
};

const buffer = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync("./examples/nasa.mp4"),
    {
      model: "nova",
    }
  );

  if (error) throw new Error(error);
  if (!error) console.log(result);
};

(async () => {
  await url();
  await readstream();
  await buffer();
})();