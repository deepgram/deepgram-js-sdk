const { createClient } = require("../../dist/main/index");

const text = `The history of the phrase 'The quick brown fox jumps over the
lazy dog'. The earliest known appearance of the phrase was in The Boston
Journal. In an article titled "Current Notes" in the February 9, 1885, edition,
the phrase is mentioned as a good practice sentence for writing students: "A
favorite copy set by writing teachers for their pupils is the following,
because it contains every letter of the alphabet: 'A quick brown fox jumps over
the lazy dog.'" Dozens of other newspapers published the phrase over the
next few months, all using the version of the sentence starting with "A" rather
than "The". The earliest known use of the phrase starting with "The" is from
the 1888 book Illustrative Shorthand by Linda Bronson.[3] The modern form
(starting with "The") became more common even though it is slightly longer than
the original (starting with "A").`;

const analyzeUrl = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.read.analyzeText(
    {
      text,
    },
    {
      language: "en",
      topics: true,
      sentiment: true,
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
};

analyzeUrl();
