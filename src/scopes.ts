import { _request } from "./httpRequest";
import { ScopeList, Message } from "./types";

export class Scopes {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param projectId Unique identifier of the project
   */
  async get(projectId: string, memberId: string): Promise<ScopeList> {
    return _request<ScopeList>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${memberId}/scopes`
    );
  }

  async update(
    projectID: string,
    memberId: string,
    scope: string
  ): Promise<Message> {
    return _request<Message>(
      "PUT",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectID}/members/${memberId}/scopes`,
      JSON.stringify({
        scope,
      })
    );
  }
}
