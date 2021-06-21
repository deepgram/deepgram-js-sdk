const fs = require('fs');
const { Deepgram } = require('../dist');

const config = {
  deepgramApiKey: '043e46d9f63dca7e3723c394d9db25c5f1fd220b',
  urlToFile: 'test.mp3'
}

function main() {

  return new Promise((resolve, reject) => {
    (async () => {

      try {

        const deepgram = new Deepgram(config.deepgramApiKey);

        /** Create a project to test with */
        const project = await deepgram.projects.create('test project');
        console.log(`Project created: ${project.id}`);

        /** Create an API key in the project */
        const apiKey = await deepgram.keys.create(project.id, "test key", ['project:write']);
        console.log(`Key created: ${apiKey.id}`);

        /** Load file into a buffer */
        const fileBuffer = fs.readFileSync(config.urlToFile);

        const newDeepgram = new Deepgram(apiKey.key);

        /** Send a pre-recorded file for transcription */
        const transcription = await newDeepgram.transcription.preRecorded({
          buffer: fileBuffer,
          mimetype: 'audio/mp3' // or appropriate mimetype of your file
        }, {
          punctuate: true
        });
        console.log(transcription);

        await deepgram.keys.delete(project.id, apiKey.id);
        console.log(`Key deleted: ${apiKey.id}`);

        await deepgram.projects.delete(project.id);
        console.log(`Project deleted: ${project.id}`);
      }
      catch (err) {
        console.log(`Err: ${err}`);
      }
    })
  });
}

main();

