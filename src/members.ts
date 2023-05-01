import { MemberList, Message, RequestFunction } from "./types";

export class Members {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * @param projectId string
   * @param endpoint string
   * @returns Promise<MemberList>
   */
  async listMembers(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<MemberList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members`
    );
  }

  /**
   * @param projectId string
   * @param memberId string
   * @param endpoint string
   * @returns Promise<Message>
   */
  async removeMember(
    projectId: string,
    memberId: string,
    endpoint = "v1/projects"
  ): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/members/${memberId}`
    );
  }
}
