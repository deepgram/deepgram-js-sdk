const { createClient } = require("../dist/main/index");

const test = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.transcription.prerecorded.listen(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova",
    }
  );

  console.log(result, error);
};

test();
