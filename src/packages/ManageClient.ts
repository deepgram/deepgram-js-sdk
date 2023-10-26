import { AbstractRestfulClient } from "./AbstractRestfulClient";
import { isDeepgramError } from "../lib/errors";
import { appendSearchParams } from "../lib/helpers";
import type {
  CreateProjectKeySchema,
  CreateProjectKeyResponse,
  DeepgramResponse,
  Fetch,
  GetProjectBalanceResponse,
  GetProjectBalancesResponse,
  GetProjectInvitesResponse,
  GetProjectKeyResponse,
  GetProjectKeysResponse,
  GetProjectMemberScopesResponse,
  GetProjectMembersResponse,
  GetProjectResponse,
  GetProjectsResponse,
  GetProjectUsageFieldsSchema,
  GetProjectUsageFieldsResponse,
  GetProjectUsageRequestResponse,
  GetProjectUsageRequestsSchema,
  GetProjectUsageRequestsResponse,
  GetProjectUsageSummarySchema,
  GetProjectUsageSummaryResponse,
  MessageResponse,
  SendProjectInviteSchema,
  UpdateProjectMemberScopeSchema,
  UpdateProjectSchema,
  VoidResponse,
} from "../lib/types";

export class ManageClient extends AbstractRestfulClient {
  /**
   * @see https://developers.deepgram.com/reference/get-projects
   */
  async getProjects(endpoint = "v1/projects"): Promise<DeepgramResponse<GetProjectsResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint;

      const result: GetProjectsResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-project
   */
  async getProject(
    projectId: string,
    endpoint = "v1/projects/:projectId"
  ): Promise<DeepgramResponse<GetProjectResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: GetProjectResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/update-project
   */
  async updateProject(
    projectId: string,
    options: UpdateProjectSchema,
    endpoint = "v1/projects/:projectId"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const body = JSON.stringify(options);

      const result: MessageResponse = await this.patch(this.fetch as Fetch, url, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/delete-project
   */
  async deleteProject(
    projectId: string,
    endpoint = "v1/projects/:projectId"
  ): Promise<VoidResponse> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      await this.delete(this.fetch as Fetch, url);

      return { error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/list-keys
   */
  async getProjectKeys(
    projectId: string,
    endpoint = "v1/projects/:projectId/keys"
  ): Promise<DeepgramResponse<GetProjectKeysResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: GetProjectKeysResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-key
   */
  async getProjectKey(
    projectId: string,
    keyId: string,
    endpoint = "v1/projects/:projectId/keys/:keyId"
  ): Promise<DeepgramResponse<GetProjectKeyResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:keyId/, keyId);

      const result: GetProjectKeyResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/create-key
   */
  async createProjectKey(
    projectId: string,
    options: CreateProjectKeySchema,
    endpoint = "v1/projects/:projectId/keys"
  ): Promise<DeepgramResponse<CreateProjectKeyResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const body = JSON.stringify(options);

      const result: CreateProjectKeyResponse = await this.post(this.fetch as Fetch, url, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/delete-key
   */
  async deleteProjectKey(
    projectId: string,
    keyId: string,
    endpoint = "v1/projects/:projectId/keys/:keyId"
  ): Promise<VoidResponse> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:keyId/, keyId);

      await this.delete(this.fetch as Fetch, url);

      return { error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-members
   */
  async getProjectMembers(
    projectId: string,
    endpoint = "v1/projects/:projectId/members"
  ): Promise<DeepgramResponse<GetProjectMembersResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: GetProjectMembersResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/remove-member
   */
  async removeProjectMember(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects/:projectId/members/:memberId"
  ): Promise<VoidResponse> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:memberId/, memberId);

      await this.delete(this.fetch as Fetch, url);

      return { error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-member-scopes
   */
  async getProjectMemberScopes(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects/:projectId/members/:memberId/scopes"
  ): Promise<DeepgramResponse<GetProjectMemberScopesResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:memberId/, memberId);

      const result: GetProjectMemberScopesResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/update-scope
   */
  async updateProjectMemberScope(
    projectId: string,
    memberId: string,
    options: UpdateProjectMemberScopeSchema,
    endpoint = "v1/projects/:projectId/members/:memberId/scopes"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:memberId/, memberId);

      const body = JSON.stringify(options);

      const result: MessageResponse = await this.put(this.fetch as Fetch, url, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/list-invites
   */
  async getProjectInvites(
    projectId: string,
    endpoint = "v1/projects/:projectId/invites"
  ): Promise<DeepgramResponse<GetProjectInvitesResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: GetProjectInvitesResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/send-invites
   */
  async sendProjectInvite(
    projectId: string,
    options: SendProjectInviteSchema,
    endpoint = "v1/projects/:projectId/invites"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const body = JSON.stringify(options);

      const result: MessageResponse = await this.post(this.fetch as Fetch, url, body);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/delete-invite
   */
  async deleteProjectInvite(
    projectId: string,
    email: string,
    endpoint = "v1/projects/:projectId/invites/:email"
  ): Promise<VoidResponse> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:email/, email);

      await this.delete(this.fetch as Fetch, url);

      return { error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/leave-project
   */
  async leaveProject(
    projectId: string,
    endpoint = "v1/projects/:projectId/leave"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: MessageResponse = await this.delete(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-all-requests
   */
  async getProjectUsageRequests(
    projectId: string,
    options: GetProjectUsageRequestsSchema,
    endpoint = "v1/projects/:projectId/requests"
  ): Promise<DeepgramResponse<GetProjectUsageRequestsResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);
      appendSearchParams(url.searchParams, options);

      const result: GetProjectUsageRequestsResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-request
   */
  async getProjectUsageRequest(
    projectId: string,
    requestId: string,
    endpoint = "v1/projects/:projectId/requests/:requestId"
  ): Promise<DeepgramResponse<GetProjectUsageRequestResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:requestId/, requestId);

      const result: GetProjectUsageRequestResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/summarize-usage
   */
  async getProjectUsageSummary(
    projectId: string,
    options: GetProjectUsageSummarySchema,
    endpoint = "v1/projects/:projectId/usage"
  ): Promise<DeepgramResponse<GetProjectUsageSummaryResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);
      appendSearchParams(url.searchParams, options);

      const result: GetProjectUsageSummaryResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-fields
   */
  async getProjectUsageFields(
    projectId: string,
    options: GetProjectUsageFieldsSchema,
    endpoint = "v1/projects/:projectId/usage/fields"
  ): Promise<DeepgramResponse<GetProjectUsageFieldsResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);
      appendSearchParams(url.searchParams, options);

      const result: GetProjectUsageFieldsResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-all-balances
   */
  async getProjectBalances(
    projectId: string,
    endpoint = "v1/projects/:projectId/balances"
  ): Promise<DeepgramResponse<GetProjectBalancesResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId);

      const result: GetProjectBalancesResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }

  /**
   * @see https://developers.deepgram.com/reference/get-balance
   */
  async getProjectBalance(
    projectId: string,
    balanceId: string,
    endpoint = "v1/projects/:projectId/balances/:balanceId"
  ): Promise<DeepgramResponse<GetProjectBalanceResponse>> {
    try {
      const url = new URL(this.baseUrl);
      url.pathname = endpoint.replace(/:projectId/, projectId).replace(/:balanceId/, balanceId);

      const result: GetProjectBalanceResponse = await this.get(this.fetch as Fetch, url);

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }

      throw error;
    }
  }
}
