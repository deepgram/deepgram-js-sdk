/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, AgentEvents } = require("../../dist/main/index");
const fetch = require("cross-fetch");
require("dotenv").config();

const agent = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const connection = deepgram.agent.live();

  connection.on(AgentEvents.Open, () => {
    console.log("Connection opened.");

    connection.configure({
      agent: {
        listen: {
          model: "nova-3",
        },
        speak: {
          model: "aura-asteria-en",
        },
      },
    });

    fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          connection.send(res.read());
        });
      });

    connection.on(AgentEvents.ConversationText, (data) => {
      console.log(data.role, data.content);
    });

    connection.on(AgentEvents.Close, () => {
      console.log("Connection closed.");
    });
  });
};

agent();
