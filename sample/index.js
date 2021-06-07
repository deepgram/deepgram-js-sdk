const { Deepgram } = require('../dist');

const config = {
  deepgramApiKey: 'Your Deepgram API Key',
  deepgramApiSecret: 'Your Deepgram API Secret',
  urlToFile: 'Url to audio file'
}

function main() {

  return new Promise((resolve, reject) => {

    const deepgram = new Deepgram({ apiKey: config.deepgramApiKey, apiSecret: config.deepgramApiSecret });

    /**
     * Transcribing a file 
     */
    deepgram.transcription.preRecorded({ url: config.urlToFile }, { punctuate: true })
      .then((result) => {
        console.log(result.results.channels[0]);
      })
      .catch((err) => {
        console.log(err);
      });

    /**
     * Create & delete projects and API keys
     */
    let key = 'Xwr5JGdWhUciiNLZ';
    deepgram.projects.create('testproject')
      .then((project) => {

        deepgram.keys.create(project.project_uuid, key, ['account:read'])
          .then((key) => {
            if (key) {
              deepgram.keys.delete(project.project_uuid, key.key)
                .then((result) => {
                  deepgram.projects.delete(project.project_uuid)
                    .then((r) => {

                      console.log(`Successfully deleted key: ${JSON.stringify(result)}`);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

  });
}

main();