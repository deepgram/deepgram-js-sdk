import { ScopeList, Message, RequestFunction, ErrorResponse } from "./types";

export class Scopes {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * Retrieves scopes of the specified member in the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} memberId Unique identifier of the member
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<ScopeList | ErrorResponse>}
   */
  async get(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects"
  ): Promise<ScopeList | ErrorResponse> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members/${memberId}/scopes`
    );
  }

  /**
   * Updates the scope for the specified member in the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} memberId Unique identifier of the member
   * @param {string} scope Scope to update the member to
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message | ErrorResponse>}
   */
  async update(
    projectID: string,
    memberId: string,
    scope: string,
    endpoint = "v1/projects"
  ): Promise<Message | ErrorResponse> {
    return this._request(
      "PUT",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectID}/members/${memberId}/scopes`,
      JSON.stringify({
        scope,
      })
    );
  }
}
