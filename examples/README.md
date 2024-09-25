# Examples for Testing Features Locally

The example projects are meant to be used to test features locally by contributors working on this SDK. In the `examples/precorded/package.json` file, you can see that the deepgram package used is the local version:

```json
"dependencies": {
    "@deepgram/sdk": "file:../../"
  }
```

This tells the example prerecorded project to use the local files within this project, not an installed package from npm.

## Steps to Test Your Code

If you are contributing changes to this SDK, you can test those changes by using the `prerecorded` or `streaming` projects in the `examples` folder. Here are the steps to follow:

### Add Your Code

Make your changes to the SDK (be sure you are on a branch you have created to do this work).

### Install dependencies for the Deepgram project

In the **root** folder of this SDK, install the dependencies:

```bash
npm i
```

### Build the Deepgram project

In the **root** folder of this SDK, build the project:

```bash
npm run build
```

### Change directories

Move into the `examples` project directory for either the `prerecorded` or the `streaming` example projects:

```bash
cd examples/prerecorded
```

### Install dependencies for the example project

Run the following command to install the example project dependencies:

```bash
npm i
```

### Edit the API key, the file, and the mimetype (as needed)

Replace the API key where it says 'YOUR_DEEPGRAM_API_KEY'

```js
const deepgramApiKey = "YOUR_DEEPGRAM_API_KEY";
const file = "YOUR_FILE_LOCATION";
const mimetype = "YOUR_FILE_MIME_TYPE";
```

### Run the project

Make sure you're in the directory with the `index.js` file and run the project with the following command.

```bash
npm run test
```
