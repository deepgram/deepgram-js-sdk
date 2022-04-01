import * as packageDetails from "../package.json";

export function userAgent(): string {
  let agent = "@deepgram/sdk/UNKNOWN node/UNKNOWN";
  try {
    agent = `@deepgram/sdk/${
      packageDetails.version
    } node/${process.version.replace("v", "")}`;
  } catch (e) {
    console.warn("Could not load package details");
  }
  return agent;
}
