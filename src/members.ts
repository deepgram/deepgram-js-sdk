// import querystring from "querystring";
import { _request } from "./httpRequest";
import { MemberList, Message } from "./types";

export class Members {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param projectId Unique identifier of the project
   */
  async listMembers(projectId: string): Promise<MemberList> {
    console.log("LIST MEMBERS", projectId);
    return _request<MemberList>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members`
    );
  }

  /**
   * Retrieves account objects for all of the accounts in the specified project.
   * @param projectId Unique identifier of the project
   * @param memberId Unique identifier of the project
   */
  async removeMember(projectId: string, memberId: string): Promise<Message> {
    console.log("REMOVE MEMBER", projectId, memberId);
    return _request<Message>(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${memberId}`
    );
  }
}
