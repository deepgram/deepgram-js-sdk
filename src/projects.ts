import { ReadStream } from "fs";
import {
  Project,
  ProjectPatchResponse,
  ProjectResponse,
  ProjectPatchRequest,
} from "./types";

export class Projects {
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
   * Returns all projects accessible by the API key
   */
  async list(): Promise<ProjectResponse> {
    return this._request("GET", this._credentials, this._apiUrl, this.apiPath);
  }

  /**
   * Retrieves a specific project based on the provided projectId
   * @param projectId Unique identifier of the project to retrieve
   */
  async get(projectId: string): Promise<Project> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}`
    );
  }

  /**
   * Update a specific project
   * @param project project to update
   */
  async update(
    project: Project,
    payload: ProjectPatchRequest
  ): Promise<ProjectPatchResponse> {
    return this._request(
      "PATCH",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${project.project_id}`,
      JSON.stringify(payload)
    );
  }
}
