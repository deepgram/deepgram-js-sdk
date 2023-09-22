import express from "express";
const app = express();
const port = 8080;

const response = async (res: any, file: string): Promise<any> => {
  const result = await import(`./mocks/${file}.ts`);

  return res.json(result.default);
};

app.post("/v1/listen", async (req: any, res: any) => {
  if ("callback" in req.query) {
    return await response(res, "asyncConfirmation");
  }

  return await response(res, "transcription");
});

app.listen(port, () => {
  console.log(`Deepgram mock server is now listening on ${port}`);
});
