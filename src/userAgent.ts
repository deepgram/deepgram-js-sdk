/*
 * The following const is replaced during the CD
 * process to the version from package.json
 */
const sdkVersion = "DG_SDK_VERSION";

export function userAgent(): string {
  let agent = "@deepgram/sdk/UNKNOWN node/UNKNOWN";
  try {
    agent = `@deepgram/sdk/${sdkVersion} node/${process.version.replace(
      "v",
      ""
    )}`;
  } catch (e) {
    console.warn("Could not load package details");
  }
  return agent;
}
