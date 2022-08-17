const { Deepgram } = require('../dist');

const config = {
  deepgramApiKey: 'YOUR_DEEPGRAM_API_KEY',
  urlToFile: 'https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav'
}

function main() {

  return new Promise((resolve, reject) => {
    (async () => {

      try {

        const deepgram = new Deepgram(config.deepgramApiKey);

        /** Send a pre-recorded file for transcription */
        const transcription = await deepgram.transcription.preRecorded({
          url: config.urlToFile
        }, {
          punctuate: true,
          utterances: true
        });
        console.log(transcription.toWebVTT());

        resolve();
      }
      catch (err) {
        console.log(`Err: ${err}`);
        reject(err);
      }
    })()
  });
}

main();

