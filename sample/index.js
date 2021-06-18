const fs = require('fs');
const { Deepgram } = require('../dist');

const config = {
  deepgramApiKey: '043e46d9f63dca7e3723c394d9db25c5f1fd220b',
  urlToFile: 'test.mp3'
}

function main() {

  return new Promise((resolve, reject) => {

    const deepgram = new Deepgram(config.deepgramApiKey);

    /** Load file into a buffer */
    const fileBuffer = fs.readFileSync(config.urlToFile);

    deepgram.transcription.preRecorded({
      buffer: fileBuffer,
      mimetype: 'audio/mp3' // or appropriate mimetype of your file 
    }, {
      punctuate: true
    })
      .then((transcription) => {
        console.log(transcription);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject();
      })
  });
}

main();

