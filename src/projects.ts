import {
  Project,
  ProjectPatchResponse,
  ProjectResponse,
  ProjectPatchRequest,
  RequestFunction,
} from "./types";

export class Projects {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  private apiPath = "/v1/projects";

  /**
   * Returns all projects accessible by the API key
   */
  async list(): Promise<ProjectResponse> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      this.apiPath
    );
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
      this._requireSSL,
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
      this._requireSSL,
      `${this.apiPath}/${project.project_id}`,
      JSON.stringify(payload)
    );
  }
}
