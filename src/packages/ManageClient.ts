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
  GetTokenDetailsResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

export class ManageClient extends AbstractRestClient {
  public namespace: string = "manage";

  /**
   * @see https://developers.deepgram.com/docs/authenticating#test-request
   */
  async getTokenDetails(
    endpoint = ":version/auth/token"
  ): Promise<DeepgramResponse<GetTokenDetailsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint);
      const result: GetTokenDetailsResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-projects
   */
  async getProjects(
    endpoint = ":version/projects"
  ): Promise<DeepgramResponse<GetProjectsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint);
      const result: GetProjectsResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-project
   */
  async getProject(
    projectId: string,
    endpoint = ":version/projects/:projectId"
  ): Promise<DeepgramResponse<GetProjectResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: GetProjectResponse = await this.get(requestUrl).then((result) => result.json());

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
    endpoint = ":version/projects/:projectId"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const body = JSON.stringify(options);

      const result: MessageResponse = await this.patch(requestUrl, body).then((result) =>
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
   * @see https://developers.deepgram.com/reference/delete-project
   */
  async deleteProject(
    projectId: string,
    endpoint = ":version/projects/:projectId"
  ): Promise<VoidResponse> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      await this.delete(requestUrl);

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
    endpoint = ":version/projects/:projectId/keys"
  ): Promise<DeepgramResponse<GetProjectKeysResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: GetProjectKeysResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-key
   */
  async getProjectKey(
    projectId: string,
    keyId: string,
    endpoint = ":version/projects/:projectId/keys/:keyId"
  ): Promise<DeepgramResponse<GetProjectKeyResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, keyId });
      const result: GetProjectKeyResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/create-key
   */
  async createProjectKey(
    projectId: string,
    options: CreateProjectKeySchema,
    endpoint = ":version/projects/:projectId/keys"
  ): Promise<DeepgramResponse<CreateProjectKeyResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const body = JSON.stringify(options);

      const result: CreateProjectKeyResponse = await this.post(requestUrl, body).then((result) =>
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
   * @see https://developers.deepgram.com/reference/delete-key
   */
  async deleteProjectKey(
    projectId: string,
    keyId: string,
    endpoint = ":version/projects/:projectId/keys/:keyId"
  ): Promise<VoidResponse> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, keyId });
      await this.delete(requestUrl);

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
    endpoint = ":version/projects/:projectId/members"
  ): Promise<DeepgramResponse<GetProjectMembersResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: GetProjectMembersResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/remove-member
   */
  async removeProjectMember(
    projectId: string,
    memberId: string,
    endpoint = ":version/projects/:projectId/members/:memberId"
  ): Promise<VoidResponse> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, memberId });
      await this.delete(requestUrl);

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
    endpoint = ":version/projects/:projectId/members/:memberId/scopes"
  ): Promise<DeepgramResponse<GetProjectMemberScopesResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, memberId });
      const result: GetProjectMemberScopesResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/update-scope
   */
  async updateProjectMemberScope(
    projectId: string,
    memberId: string,
    options: UpdateProjectMemberScopeSchema,
    endpoint = ":version/projects/:projectId/members/:memberId/scopes"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, memberId }, options);
      const body = JSON.stringify(options);

      const result: MessageResponse = await this.put(requestUrl, body).then((result) =>
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
   * @see https://developers.deepgram.com/reference/list-invites
   */
  async getProjectInvites(
    projectId: string,
    endpoint = ":version/projects/:projectId/invites"
  ): Promise<DeepgramResponse<GetProjectInvitesResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: GetProjectInvitesResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/send-invites
   */
  async sendProjectInvite(
    projectId: string,
    options: SendProjectInviteSchema,
    endpoint = ":version/projects/:projectId/invites"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const body = JSON.stringify(options);

      const result: MessageResponse = await this.post(requestUrl, body).then((result) =>
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
   * @see https://developers.deepgram.com/reference/delete-invite
   */
  async deleteProjectInvite(
    projectId: string,
    email: string,
    endpoint = ":version/projects/:projectId/invites/:email"
  ): Promise<VoidResponse> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, email });
      await this.delete(requestUrl).then((result) => result.json());

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
    endpoint = ":version/projects/:projectId/leave"
  ): Promise<DeepgramResponse<MessageResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: MessageResponse = await this.delete(requestUrl).then((result) => result.json());

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
    endpoint = ":version/projects/:projectId/requests"
  ): Promise<DeepgramResponse<GetProjectUsageRequestsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const result: GetProjectUsageRequestsResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-request
   */
  async getProjectUsageRequest(
    projectId: string,
    requestId: string,
    endpoint = ":version/projects/:projectId/requests/:requestId"
  ): Promise<DeepgramResponse<GetProjectUsageRequestResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, requestId });
      const result: GetProjectUsageRequestResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/summarize-usage
   */
  async getProjectUsageSummary(
    projectId: string,
    options: GetProjectUsageSummarySchema,
    endpoint = ":version/projects/:projectId/usage"
  ): Promise<DeepgramResponse<GetProjectUsageSummaryResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const result: GetProjectUsageSummaryResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-fields
   */
  async getProjectUsageFields(
    projectId: string,
    options: GetProjectUsageFieldsSchema,
    endpoint = ":version/projects/:projectId/usage/fields"
  ): Promise<DeepgramResponse<GetProjectUsageFieldsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId }, options);
      const result: GetProjectUsageFieldsResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-all-balances
   */
  async getProjectBalances(
    projectId: string,
    endpoint = ":version/projects/:projectId/balances"
  ): Promise<DeepgramResponse<GetProjectBalancesResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId });
      const result: GetProjectBalancesResponse = await this.get(requestUrl).then((result) =>
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
   * @see https://developers.deepgram.com/reference/get-balance
   */
  async getProjectBalance(
    projectId: string,
    balanceId: string,
    endpoint = ":version/projects/:projectId/balances/:balanceId"
  ): Promise<DeepgramResponse<GetProjectBalanceResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { projectId, balanceId });
      const result: GetProjectBalanceResponse = await this.get(requestUrl).then((result) =>
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
