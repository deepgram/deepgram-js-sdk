import { ReadStream } from "fs";
import { ScopeList, Message } from "./types";

export class Scopes {
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
   * Retrieves scopes of the specified member in the specified project.
   * @param projectId Unique identifier of the project
   * @param memberId Unique identifier of the member
   */
  async get(projectId: string, memberId: string): Promise<ScopeList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${memberId}/scopes`
    );
  }

  /**
   * Updates the scope for the specified member in the specified project.
   * @param projectId Unique identifier of the project
   * @param memberId Unique identifier of the member being updated
   * @param scope string of the scope to update to
   */
  async update(
    projectID: string,
    memberId: string,
    scope: string
  ): Promise<Message> {
    return this._request(
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
