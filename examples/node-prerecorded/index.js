/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient } = require("../../packages/core/dist/main/index");
const { readFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config();

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

  const filePath = resolve(__dirname, "../spacewalk.wav");
  console.log(filePath);
  const file = readFileSync(filePath);

  console.log("Transcribing file", file);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(file, {
    model: "nova-3",
  });

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

const transcribe = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const audio = readFileSync(resolve(__dirname, "../spacewalk.wav"));

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audio, {
    model: "nova-3",
  });

  if (error) {
    console.error(error);
  } else {
    console.log(result.results.channels[0].alternatives[0].transcript);
  }
};

(async () => {
  await transcribeUrl();
  await transcribeFile();
  await transcribeUrlAuthWithFactory();
  await transcribeUrlWithAccessToken();
  await transcribe();
})();
