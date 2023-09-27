import { AbstractRestfulClient } from "./AbstractRestfulClient";
import { isDeepgramError } from "../lib/errors";
import type {
  CreateOnPremCredentialsOptions,
  DeepgramResponse,
  Fetch,
  ListOnPremCredentialsResponse,
  MessageResponse,
  OnPremCredentialResponse,
} from "../lib/types";

export class OnPremClient extends AbstractRestfulClient {
  /**
   * @see https://developers.deepgram.com/reference/list-credentials
   */
  async listCredentials(
    projectId: string,
    endpoint = "v1/projects/:projectId/onprem/distribution/credentials"
  ): Promise<DeepgramResponse<ListOnPremCredentialsResponse>> {
    try {
      const url = this.url;
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: ListOnPremCredentialsResponse = await this.get(this.fetch as Fetch, url, {
        headers: this.headers,
      });

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
    endpoint = "v1/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ): Promise<DeepgramResponse<OnPremCredentialResponse>> {
    try {
      const url = this.url;
      url.pathname = endpoint
        .replace(/:projectId/, projectId)
        .replace(/:credentialsId/, credentialsId);

      const result: OnPremCredentialResponse = await this.get(this.fetch as Fetch, url, {
        headers: this.headers,
      });

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
    options: CreateOnPremCredentialsOptions,
    endpoint = "v1/projects/:projectId/onprem/distribution/credentials"
  ): Promise<DeepgramResponse<OnPremCredentialResponse>> {
    try {
      const url = this.url;
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const body = JSON.stringify(options);

      const result: OnPremCredentialResponse = await this.post(this.fetch as Fetch, url, body, {
        headers: this.headers,
      });

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
    endpoint = "v1/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const url = this.url;
      url.pathname = endpoint
        .replace(/:projectId/, projectId)
        .replace(/:credentialsId/, credentialsId);

      const result: MessageResponse = await this.delete(this.fetch as Fetch, url, {
        headers: this.headers,
      });

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
