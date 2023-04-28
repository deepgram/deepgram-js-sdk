import {
  Message,
  InvitationOptions,
  InvitationList,
  RequestFunction,
} from "./types";

export class Invitation {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * @param projectId string
   * @param endpoint string
   * @returns Promise<InvitationList>
   */
  async list(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<InvitationList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/invites`
    );
  }

  /**
   * @param projectId string
   * @param options InvitationOptions
   * @param endpoint string
   * @returns Promise<Message>
   */
  async send(
    projectId: string,
    options: InvitationOptions,
    endpoint = "v1/projects"
  ): Promise<Message> {
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
   * @param projectId string
   * @param endpoint string
   * @returns Promise<Message>
   */
  async leave(projectId: string, endpoint = "v1/projects"): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/leave`
    );
  }

  /**
   * @param projectId string
   * @param email string
   * @param endpoint string
   * @returns Promise<Message>
   * NOTE: This will return successful even if the email does not have an invite on the project.
   */
  async delete(
    projectId: string,
    email: string,
    endpoint = "v1/projects"
  ): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/invites/${email}`
    );
  }
}
