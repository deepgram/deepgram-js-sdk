import { isDeepgramError } from "../lib/errors";
import type {
  CreateOnPremCredentialsSchema,
  DeepgramResponse,
  Fetch,
  ListOnPremCredentialsResponse,
  MessageResponse,
  OnPremCredentialResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

export class SelfHostedClient extends AbstractRestClient {
  public namespace: string = "selfhosted";

  /**
   * @see https://developers.deepgram.com/reference/list-credentials
   */
  async listCredentials(
    projectId: string,
    endpoint = ":version/projects/:projectId/onprem/distribution/credentials"
  ): Promise<DeepgramResponse<ListOnPremCredentialsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: ListOnPremCredentialsResponse = await this.get(requestUrl).then((result) =>
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

  /**
   * @see https://developers.deepgram.com/reference/get-credentials
   */
  async getCredentials(
    projectId: string,
    credentialsId: string,
    endpoint = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ): Promise<DeepgramResponse<OnPremCredentialResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, credentialsId });
      const result: OnPremCredentialResponse = await this.get(requestUrl).then((result) =>
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

  /**
   * @see https://developers.deepgram.com/reference/create-credentials
   */
  async createCredentials(
    projectId: string,
    options: CreateOnPremCredentialsSchema,
    endpoint = ":version/projects/:projectId/onprem/distribution/credentials"
  ): Promise<DeepgramResponse<OnPremCredentialResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const body = JSON.stringify(options);

      const result: OnPremCredentialResponse = await this.post(requestUrl, body).then((result) =>
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

  /**
   * @see https://developers.deepgram.com/reference/delete-credentials
   */
  async deleteCredentials(
    projectId: string,
    credentialsId: string,
    endpoint = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, credentialsId });
      const result: MessageResponse = await this.delete(requestUrl).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
