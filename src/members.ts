import { MemberList, Message, RequestFunction, ErrorResponse } from "./types";

export class Members {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<MemberList | ErrorResponse>}
   */
  async listMembers(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<MemberList | ErrorResponse> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members`
    );
  }

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} memberId Unique identifier of the member
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message | ErrorResponse>}
   */
  async removeMember(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects"
  ): Promise<Message | ErrorResponse> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members/${memberId}`
    );
  }
}
