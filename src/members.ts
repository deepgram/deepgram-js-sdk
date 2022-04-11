import { ReadStream } from "fs";
import { MemberList, Message } from "./types";

export class Members {
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
   * Retrieves account objects for all of the accounts in the specified project.
   * @param projectId Unique identifier of the project
   */
  async listMembers(projectId: string): Promise<MemberList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members`
    );
  }

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param projectId Unique identifier of the project
   * @param memberId Unique identifier of the member
   */
  async removeMember(projectId: string, memberId: string): Promise<Message> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${memberId}`
    );
  }
}
