import { userAgent } from "../userAgent";

export async function _request<T>(
  method: string,
  api_key: string,
  apiUrl: string,
  path: string,
  payload?: string
): Promise<T> {
  const url = `https://${apiUrl}${path}`;
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `token ${api_key}`,
        "Content-Type": "application/json",
        "X-DG-Agent": userAgent(),
      },
      body: payload,
    });
    const json = await response.json();
    return json;
  } catch (err) {
    throw new Error(`DG: ${err}`);
  }
}
