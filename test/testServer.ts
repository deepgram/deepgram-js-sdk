import express, { Request, Response } from "express";
import expressWs from "express-ws";
const app = expressWs(express()).app;
const port = 8080;

app.use(function (req, res, next) {
  delete req.headers["token"]; // never do anything with the token, incase a real one is sent in
  next();
});

const responseString = async (file: string): Promise<any> => {
  const result = await import(`./mocks/${file}`);

  return result.default;
};

const response = async (res: any, file: string): Promise<any> => {
  return res.json(await responseString(file));
};

app.ws("/v1/listen", async (ws, req) => {
  ws.send(JSON.stringify(await responseString("liveMetadata")));

  ws.on("message", async (message) => {
    if (Buffer.isBuffer(message)) {
      const byteLength = (message as Buffer).byteLength;

      if (byteLength > 0) {
        ws.send(JSON.stringify(await responseString("liveTranscription")));
      } else {
        ws.close();
      }
    } else {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case "CloseStream":
            ws.close();
            break;
          case "Configure":
            break;
          case "KeepAlive":
            break;
          default:
            ws.send(JSON.stringify(await responseString("liveMetadata")));
            break;
        }
      } catch (error) {
        console.log(error);
        ws.close();
      }
    }
  });
});

// transcription and callback transcription requests
app.post("/v1/listen", async (req: Request, res: Response) => {
  if ("callback" in req.query) {
    return await response(res, "asyncConfirmation");
  }

  return await response(res, "transcription");
});

// get projects
app.get("/v1/projects", async (req: Request, res: Response) => {
  return await response(res, "projects");
});

// get project
app.get("/v1/projects/:projectId", async (req: Request, res: Response) => {
  return await response(res, "project");
});

// update project
app.patch("/v1/projects/:projectId", async (req: Request, res: Response) => {
  return await response(res, "message");
});

// delete project
app.delete("/v1/projects/:projectId", (req: Request, res: Response) => {
  return res.json({});
});

// get all project keys
app.get("/v1/projects/:projectId/keys", async (req: Request, res: Response) => {
  return await response(res, "projectKeys");
});

// get a project key
app.get("/v1/projects/:projectId/keys/:keyId", async (req: Request, res: Response) => {
  return await response(res, "projectKey");
});

// create a project key
app.post("/v1/projects/:projectId/keys", async (req: Request, res: Response) => {
  return await response(res, "newProjectKey");
});

// delete a project key
app.delete("/v1/projects/:projectId/keys/:keyId", async (req: Request, res: Response) => {
  return await response(res, "message");
});

// get project all keys
app.get("/v1/projects/:projectId/members", async (req: Request, res: Response) => {
  return await response(res, "projectMembers");
});

// remove a project member
app.delete("/v1/projects/:projectId/members/:memberId", async (req: Request, res: Response) => {
  return res.json({});
});

// get all scopes for a project member
app.get("/v1/projects/:projectId/members/:memberId/scopes", async (req: Request, res: Response) => {
  return await response(res, "projectMemberScopes");
});

// update a scope for a project member
app.put("/v1/projects/:projectId/members/:memberId/scopes", async (req: Request, res: Response) => {
  return await response(res, "message");
});

// get all project invites
app.get("/v1/projects/:projectId/invites", async (req: Request, res: Response) => {
  return await response(res, "projectInvites");
});

// send a project invite
app.post("/v1/projects/:projectId/invites", async (req: Request, res: Response) => {
  return await response(res, "message");
});

// delete a project invite
app.delete("/v1/projects/:projectId/invites/:email", async (req: Request, res: Response) => {
  return res.json({});
});

// leave a project
app.delete("/v1/projects/:projectId/leave", async (req: Request, res: Response) => {
  return await response(res, "message");
});

// get all usage requests for a project
app.get("/v1/projects/:projectId/requests", async (req: Request, res: Response) => {
  return await response(res, "projectUsageRequests");
});

// get a usage request for a project
app.get("/v1/projects/:projectId/requests/:requestId", async (req: Request, res: Response) => {
  return await response(res, "projectUsageRequest");
});

// get the project usage summary
app.get("/v1/projects/:projectId/usage", async (req: Request, res: Response) => {
  return await response(res, "projectUsageSummary");
});

// get project usage fields
app.get("/v1/projects/:projectId/usage/fields", async (req: Request, res: Response) => {
  return await response(res, "projectUsageFields");
});

// get all project balances
app.get("/v1/projects/:projectId/balances", async (req: Request, res: Response) => {
  return await response(res, "projectBalances");
});

// get a project balance
app.get("/v1/projects/:projectId/balances/:balanceId", async (req: Request, res: Response) => {
  return await response(res, "projectBalance");
});

// list onprem credentials
app.get(
  "/v1/projects/:projectId/onprem/distribution/credentials",
  async (req: Request, res: Response) => {
    return await response(res, "onpremCredentials");
  }
);

// get onprem credentials
app.get(
  "/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId",
  async (req: Request, res: Response) => {
    return await response(res, "onpremCredential");
  }
);

// create onprem credentials
app.post(
  "/v1/projects/:projectId/onprem/distribution/credentials",
  async (req: Request, res: Response) => {
    return await response(res, "newOnpremCredential");
  }
);

// delete onprem credentials
app.delete(
  "/v1/projects/:projectId/onprem/distribution/credentials/:credentialsId",
  async (req: Request, res: Response) => {
    return await response(res, "message");
  }
);

app.listen(port, () => {
  console.log(`Deepgram mock server is now listening on ${port}`);
});
