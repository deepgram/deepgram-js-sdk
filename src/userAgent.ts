import path from "path";

export function userAgent(): string {
  let agent = "@deepgram/sdk/UNKNOWN node/UNKNOWN";
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageDetails = require(path.join(__dirname, "..", "package.json"));
    agent = `@deepgram/sdk/${
      packageDetails.version
    } node/${process.version.replace("v", "")}`;
  } catch (e) {
    console.warn("Could not load package details");
  }
  return agent;
}
