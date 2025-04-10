const { createClient } = require("../../dist/main/index");

const transcribeUrl = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const { result: token, error: tokenError } = await deepgram.auth.grantToken();
  if (tokenError) {
    throw tokenError;
  }
  console.log("Token", token);

  console.log("Transcribing URL", "https://dpgr.am/spacewalk.wav");
  deepgram.token = token.access_token;
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova-3",
      keyterm: ["spacewalk"],
    }
  );

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 5 });
};

transcribeUrl();
