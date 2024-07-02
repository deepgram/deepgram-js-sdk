import { require } from "https://deno.land/x/require/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";
import { fileURLToPath } from "https://deno.land/std@0.177.0/node/url.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { createClient } = require("../../dist/module/index.js");

const transcribeUrl = async () => {
  const deepgram = createClient(Deno.env.get("DEEPGRAM_API_KEY"));

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
  const deepgram = createClient(Deno.env.get("DEEPGRAM_API_KEY"));

  const filePath = path.join(__dirname, "../spacewalk.wav");
  console.log(filePath);
  const file = await Deno.readFile(filePath);

  console.log("Transcribing file", file);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(file, {
    model: "nova-2",
  });

  if (error) console.error(error);
  if (!error) console.dir(result, { depth: 1 });
};

transcribeUrl();
transcribeFile();
