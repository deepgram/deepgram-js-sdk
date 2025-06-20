const { createClient } = require("../../dist/main/index");
const fs = require("fs");
const path = require("path");

const transcribeUrlAuthWithFactory = async () => {
  console.log("transcribing url with auth factory");

  const authFactory = async () => {
    const deepgramTokenClient = createClient(process.env.DEEPGRAM_API_KEY);

    const { result: tokenResult, error: tokenError } = await deepgramTokenClient.auth.grantToken();

    if (tokenError) console.error(tokenError);
    if (!tokenError) return tokenResult.access_token;
  };

  const deepgramClient = createClient({ accessToken: authFactory });

  console.log("Transcribing URL", "https://dpgr.am/spacewalk.wav");
  const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova-3",
    }
  );

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

const transcribeUrlWithAccessToken = async () => {
  console.log("transcribing url with access token");

  const deepgramTokenClient = createClient(process.env.DEEPGRAM_API_KEY);

  const { result: tokenResult, error: tokenError } = await deepgramTokenClient.auth.grantToken();

  if (tokenError) console.error(tokenError);

  const deepgramClient = createClient({ accessToken: tokenResult.access_token });

  console.log("Transcribing URL", "https://dpgr.am/spacewalk.wav");
  const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova-3",
    }
  );

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

const transcribeUrl = async () => {
  console.log("transcribing url with api key");

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  console.log("Transcribing URL", "https://dpgr.am/spacewalk.wav");
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: "https://dpgr.am/spacewalk.wav",
    },
    {
      model: "nova-3",
    }
  );

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

const transcribeFile = async () => {
  console.log("transcribing file with api key");

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const filePath = path.join(__dirname, "../spacewalk.wav");
  console.log(filePath);
  const file = fs.readFileSync(filePath);

  console.log("Transcribing file", file);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(file, {
    model: "nova-3",
  });

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

(async () => {
  await transcribeUrl();
  await transcribeFile();
  await transcribeUrlAuthWithFactory();
  await transcribeUrlWithAccessToken();
})();
