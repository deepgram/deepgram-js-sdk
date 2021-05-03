const { Deepgram } = require('../dist');

const config = {
  deepgramApiKey: 'Your Deepgram API Key',
  deepgramApiSecret: 'Your Deepgram API Secret',
  urlToFile: 'Url to audio file'
}

function main() {

  return new Promise((resolve, reject) => {

    const deepgram = new Deepgram({ apiKey: config.deepgramApiKey, apiSecret: config.deepgramApiSecret });

    // deepgram.transcribe(config.urlToFile, { punctuate: true })
    //   .then((result) => {
    //     console.log(result.results.channels[0]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    let key;
    deepgram.keys.create('test')
      .then((result) => {
        key = result.key

        if (key) {
          deepgram.keys.delete(key)
            .then((result) => {
              console.log(`Successfully deleted key: ${JSON.stringify(result)}`);
            })
            .catch((err) => {
              console.log(err);
            })
        }

      })
      .catch((err) => {
        console.log(err);
      });


  });
}

main();