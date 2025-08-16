import { isDeepgramError } from "../lib/errors";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";
import type { GrantTokenResponse } from "../lib/types/GrantTokenResponse";
import type { GrantTokenSchema } from "../lib/types/GrantTokenSchema";
import { AbstractRestClient } from "./AbstractRestClient";

export class AuthRestClient extends AbstractRestClient {
  public namespace: string = "auth";

  /**
   * Generates a new temporary token for the Deepgram API.
   * @param options Optional configuration options for the token generation. Includes ttl_seconds to set token expiration.
   * @param endpoint Optional custom endpoint to use for the request. Defaults to ":version/auth/grant".
   * @returns Object containing the result of the request or an error if one occurred. Result will contain access_token and expires_in properties.
   */
  public async grantToken(
    options: GrantTokenSchema = {},
    endpoint = ":version/auth/grant"
  ): Promise<DeepgramResponse<GrantTokenResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint);
      const body = JSON.stringify(options);
      const result: GrantTokenResponse = await this.post(requestUrl, body, {
        headers: { "Content-Type": "application/json" },
      }).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
