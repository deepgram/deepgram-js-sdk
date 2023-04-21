import { userAgent } from "../userAgent";

export async function _request<T>(
  method: string,
  api_key: string,
  apiUrl: string,
  requireSSL: boolean,
  path: string,
  payload?: string
): Promise<T> {
  const protocol = requireSSL ? "https" : "http";
  const url = `${protocol}://${apiUrl}${path}`;
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
    let json;
    if (!response.ok) {
      json = await response.json();
      throw new Error(`${json.err_code}: ${json.err_msg}`);
    }
    json = await response.json();
    return json;
  } catch (err) {
    throw `DG: ${err}`;
  }
}
