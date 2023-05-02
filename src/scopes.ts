import { ScopeList, Message, RequestFunction } from "./types";

export class Scopes {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * @param projectId string
   * @param memberId string
   * @param endpoint string
   * @returns Promise<ScopeList>
   */
  async get(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects"
  ): Promise<ScopeList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members/${memberId}/scopes`
    );
  }

  /**
   * @param projectID string
   * @param memberId string
   * @param scope string
   * @param endpoint string
   * @returns Promise<Message>
   */
  async update(
    projectID: string,
    memberId: string,
    scope: string,
    endpoint = "v1/projects"
  ): Promise<Message> {
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
