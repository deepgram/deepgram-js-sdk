import { AbstractRestClient } from "./AbstractRestClient";
import { isDeepgramError } from "../lib/errors";
import type {
  CreateOnPremCredentialsSchema,
  DeepgramResponse,
  Fetch,
  ListOnPremCredentialsResponse,
  MessageResponse,
  OnPremCredentialResponse,
} from "../lib/types";

export class OnPremClient extends AbstractRestClient {
  public namespace: string = "onprem";

  /**
   * @see https://developers.deepgram.com/reference/list-credentials
   */
  async listCredentials(
    projectId: string,
    endpoint = ":version/projects/:projectId/onprem/distribution/credentials"
  ): Promise<DeepgramResponse<ListOnPremCredentialsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: ListOnPremCredentialsResponse = await this.get(this.fetch as Fetch, requestUrl);

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
      const result: OnPremCredentialResponse = await this.get(this.fetch as Fetch, requestUrl);

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

      const result: OnPremCredentialResponse = await this.post(
        this.fetch as Fetch,
        requestUrl,
        body
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
      const result: MessageResponse = await this.delete(this.fetch as Fetch, requestUrl);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
