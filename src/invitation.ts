import {
  Message,
  InvitationOptions,
  InvitationList,
  RequestFunction,
  ErrorResponse
} from "./types";

export class Invitation {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * Lists all the current invites of a specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<InvitationList>}
   */
  async list(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<InvitationList | ErrorResponse> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/invites`
    );
  }

  /**
   * Sends an invitation to join the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {InvitationOptions} options Used to define the email and scope of the invitee
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message>}
   */
  async send(
    projectId: string,
    options: InvitationOptions,
    endpoint = "v1/projects"
  ): Promise<Message | ErrorResponse> {
    return this._request(
      "POST",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/invites`,
      JSON.stringify({
        email: options.email,
        scope: options.scope,
      })
    );
  }

  /**
   * Removes the authenticated account from the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message>}
   */
  async leave(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<Message | ErrorResponse> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/leave`
    );
  }

  /**
   * Removes the specified email from the invitations on the specified project.
   * NOTE: This will return successful even if the email does not have an invite on the project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} email Email of the invite to delete
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message>}
   */
  async delete(
    projectId: string,
    email: string,
    endpoint = "v1/projects"
  ): Promise<Message | ErrorResponse> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/invites/${email}`
    );
  }
}
