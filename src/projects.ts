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

  /**
   * @param endpoint string
   * @returns Promise<ProjectResponse>
   */
  async list(endpoint = "v1/projects"): Promise<ProjectResponse> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}`
    );
  }

  /**
   * @param projectId string
   * @param endpoint string
   * @returns Promise<Project>
   */
  async get(projectId: string, endpoint = "v1/projects"): Promise<Project> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}`
    );
  }

  /**
   * @param project Project
   * @param payload ProjectPatchRequest
   * @param endpoint string
   * @returns Promise<ProjectPatchResponse>
   */
  async update(
    project: Project,
    payload: ProjectPatchRequest,
    endpoint = "v1/projects"
  ): Promise<ProjectPatchResponse> {
    return this._request(
      "PATCH",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${project.project_id}`,
      JSON.stringify(payload)
    );
  }

  /**
   * @param projectId string
   * @param endpoint string
   * @returns Promise<void>
   */
  async delete(projectId: string, endpoint = "v1/projects"): Promise<void> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}`
    );
  }
}
