// Example filename: index.js

const { Deepgram } = require("@deepgram/sdk");
const fetch = require("cross-fetch");

// Your Deepgram API Key
const deepgramApiKey = "YOUR_DEEPGRAM_API_KEY";

// URL for the audio you would like to stream
// URL for the example resource will change depending on whether user is outside or inside the UK
// Outside the UK
const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";
// Inside the UK
// const url = 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm';

// Initialize the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

// Create a websocket connection to Deepgram
// In this example, punctuation is turned on, interim results are turned off, and language is set to UK English.
const deepgramLive = deepgram.transcription.live({
	smart_format: true,
	interim_results: false,
	language: "en-US",
	model: "nova",
});

// Listen for the connection to open and send streaming audio from the URL to Deepgram
fetch(url)
	.then((r) => r.body)
	.then((res) => {
		res.on("readable", () => {
			if (deepgramLive.getReadyState() == 1) {
				deepgramLive.send(res.read());
			}
		});
	});

// Listen for the connection to close
deepgramLive.addListener("close", () => {
	console.log("Connection closed.");
});

// Listen for any transcripts received from Deepgram and write them to the console
deepgramLive.addListener("transcriptReceived", (message) => {
	const data = JSON.parse(message);

	// Write the entire response to the console
	console.dir(data.channel, { depth: null });

	// Write only the transcript to the console
	//console.dir(data.channel.alternatives[0].transcript, { depth: null });
});