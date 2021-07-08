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

        /** Get a project to test with */
        const projects = await deepgram.projects.list();
        if (projects.projects.length === 0) resolve();

        const project = projects.projects[0];

        /** Create an API key in the project */
        const apiKey = await deepgram.keys.create(project.id, "test key", ['member']);
        console.log(`Key created: ${apiKey.id}`);

        const newDeepgram = new Deepgram(apiKey.key);

        /** Send a pre-recorded file for transcription */
        const transcription = await newDeepgram.transcription.preRecorded({
          url: config.urlToFile
        }, {
          punctuate: true
        });
        console.dir(transcription, { depth: null });

        /** Retrieve & log usage for this project */
        const usage = await newDeepgram.usage.listRequests(project.id);
        console.dir(usage, { depth: null });

        await deepgram.keys.delete(project.id, apiKey.id);
        console.log(`Key deleted: ${apiKey.id}`);

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

