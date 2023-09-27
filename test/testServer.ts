import express from "express";
const app = express();
const port = 8080;

const response = async (res: any, file: string): Promise<any> => {
  const result = await import(`./mocks/${file}.ts`);

  return res.json(result.default);
};

// transcription and callback transcription requests
app.post("/v1/listen", async (req: any, res: any) => {
  if ("callback" in req.query) {
    return await response(res, "asyncConfirmation");
  }

  return await response(res, "transcription");
});

// get projects
app.get("/v1/projects", async (req: any, res: any) => {
  return await response(res, "projects");
});

// get project
app.get("/v1/projects/:projectId", async (req: any, res: any) => {
  return await response(res, "project");
});

// update project
app.patch("/v1/projects/:projectId", async (req: any, res: any) => {
  return await response(res, "message");
});

// delete project
app.delete("/v1/projects/:projectId", (req: any, res: any) => {
  return res.json({});
});

// get all project keys
app.get("/v1/projects/:projectId/keys", async (req: any, res: any) => {
  return await response(res, "projectKeys");
});

// get a project key
app.get("/v1/projects/:projectId/keys/:keyId", async (req: any, res: any) => {
  return await response(res, "projectKey");
});

// create a project key
app.post("/v1/projects/:projectId/keys", async (req: any, res: any) => {
  return await response(res, "newProjectKey");
});

// delete a project key
app.delete("/v1/projects/:projectId/keys/:keyId", async (req: any, res: any) => {
  return await response(res, "message");
});

// get project all keys
app.get("/v1/projects/:projectId/members", async (req: any, res: any) => {
  return await response(res, "projectMembers");
});

// remove a project member
app.delete("/v1/projects/:projectId/members/:memberId", async (req: any, res: any) => {
  return res.json({});
});

// get all scopes for a project member
app.get("/v1/projects/:projectId/members/:memberId/scopes", async (req: any, res: any) => {
  return await response(res, "projectMemberScopes");
});

// update a scope for a project member
app.put("/v1/projects/:projectId/members/:memberId/scopes", async (req: any, res: any) => {
  return await response(res, "message");
});

// get all project invites
app.get("/v1/projects/:projectId/invites", async (req: any, res: any) => {
  return await response(res, "projectInvites");
});

// send a project invite
app.post("/v1/projects/:projectId/invites", async (req: any, res: any) => {
  return await response(res, "message");
});

// delete a project invite
app.delete("/v1/projects/:projectId/invites/:email", async (req: any, res: any) => {
  return res.json({});
});

// leave a project
app.delete("/v1/projects/:projectId/leave", async (req: any, res: any) => {
  return await response(res, "message");
});

// get all usage requests for a project
app.get("/v1/projects/:projectId/requests", async (req: any, res: any) => {
  return await response(res, "projectUsageRequests");
});

// get a usage request for a project
app.get("/v1/projects/:projectId/requests/:requestId", async (req: any, res: any) => {
  return await response(res, "projectUsageRequest");
});

// get the project usage summary
app.get("/v1/projects/:projectId/usage", async (req: any, res: any) => {
  return await response(res, "projectUsageSummary");
});

// get project usage fields
app.get("/v1/projects/:projectId/usage/fields", async (req: any, res: any) => {
  return await response(res, "projectUsageFields");
});

// get all project balances
app.get("/v1/projects/:projectId/balances", async (req: any, res: any) => {
  return await response(res, "projectBalances");
});

// get a project balance
app.get("/v1/projects/:projectId/balances/:balanceId", async (req: any, res: any) => {
  return await response(res, "projectBalance");
});

// list onprem credentials
app.get("/v1/projects/:projectId/onprem/distribution/credentials", async (req: any, res: any) => {
  return await response(res, "onpremCredentials");
});

// get onprem credentials
app.get(
  "/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId",
  async (req: any, res: any) => {
    return await response(res, "onpremCredential");
  }
);

// create onprem credentials
app.post("/v1/projects/:projectId/onprem/distribution/credentials", async (req: any, res: any) => {
  return await response(res, "newOnpremCredential");
});

// delete onprem credentials
app.delete(
  "/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId",
  async (req: any, res: any) => {
    return await response(res, "message");
  }
);

app.listen(port, () => {
  console.log(`Deepgram mock server is now listening on ${port}`);
});
