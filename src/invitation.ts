import { _request } from "./httpRequest";
import { Message, InvitationOptions, InvitationList } from "./types";

export class Invitation {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Lists all the current invites of a specified project.
   * @param projectId Unique identifier of the project
   */
  async list(projectId: string): Promise<InvitationList> {
    return _request<InvitationList>(
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
    return _request<Message>(
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
    return _request<Message>(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/leave`
    );
  }

  /**
   * Removes the specified email from the specified project.
   * @param projectId Unique identifier of the project
   *
   * NOTE: This will return successful even if the email does not exist on the account. It is better to handle account removal from the Deepgram console https://console.deepgram.com/
   */
  async delete(projectId: string, email: string): Promise<Message> {
    return _request<Message>(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/invites/${email}`
    );
  }
}
