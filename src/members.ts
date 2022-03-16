// import querystring from "querystring";
import { _request } from "./httpRequest";
import { MemberList } from "./types";

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
}
