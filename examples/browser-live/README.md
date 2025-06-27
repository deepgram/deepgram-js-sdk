# Live Transcription (Browser)

This example demonstrates how to transcribe a live audio stream in the browser using the Deepgram JS SDK.

## Setup

1.  From the root of the project, start a local web server:

    ```bash
    npx http-server .
    ```

2.  Open your browser to the following URL:

    [http://localhost:8080/examples/browser-live/](http://localhost:8080/examples/browser-live/)

3.  Add your `DEEPGRAM_API_KEY` as a query string parameter to the URL.

    For example: `http://localhost:8080/examples/browser-live/?key=YOUR_DEEPGRAM_API_KEY`

## Usage

Once the page is loaded with your API key, you can use the "Start" and "Stop" buttons to control the live transcription.
