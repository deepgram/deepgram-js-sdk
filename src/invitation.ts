import { ReadStream } from "fs";

import { Message, InvitationOptions, InvitationList } from "./types";

export class Invitation {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _request:
      | ((
          method: string,
          api_key: string,
          apiUrl: string,
          path: string,
          payload?: string | Buffer | ReadStream,
          // eslint-disable-next-line @typescript-eslint/ban-types
          options?: Object
        ) => Promise<any>)
      | ((
          method: string,
          api_key: string,
          apiUrl: string,
          path: string,
          payload?: string
        ) => Promise<any>)
  ) {}

  private apiPath = "/v1/projects";

  /**
   * Lists all the current invites of a specified project.
   * @param projectId Unique identifier of the project
   */
  async list(projectId: string): Promise<InvitationList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/invites`
    );
  }

  /**
   * Sends an invitation to join the specified project.
   * @param projectId Unique identifier of the project
   */
  async send(projectId: string, options: InvitationOptions): Promise<Message> {
    return this._request(
      "POST",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/invites`,
      JSON.stringify({
        email: options.email,
        scope: options.scope,
      })
    );
  }

  /**
   * Removes the authenticated account from the specified project.
   * @param projectId Unique identifier of the project
   */
  async leave(projectId: string): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/leave`
    );
  }

  /**
   * Removes the specified email from the invitations on the specified project.
   * @param projectId Unique identifier of the project
   * @param email email address of the invitee
   * NOTE: This will return successful even if the email does not have an invite on the project.
   */
  async delete(projectId: string, email: string): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/invites/${email}`
    );
  }
}
