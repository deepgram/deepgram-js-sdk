import { isDeepgramError } from "../lib/errors";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";
import type { GrantTokenResponse } from "../lib/types/GrantTokenResponse";
import { AbstractRestClient } from "./AbstractRestClient";

export class AuthRestClient extends AbstractRestClient {
  public namespace: string = "auth";

  public async grantToken(
    endpoint = ":version/auth/grant"
  ): Promise<DeepgramResponse<GrantTokenResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint);
      const result: GrantTokenResponse = await this.post(requestUrl, "").then((result) =>
        result.json()
      );

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
