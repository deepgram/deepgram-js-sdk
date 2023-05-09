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
   * Returns all projects accessible by the API key.
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<ProjectResponse>}
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
   * Retrieves a specific project based on the provided project_id.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Project>}
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
   * Update a project.
   * @param {Project} project Project to update
   * @param {ProjectPatchRequest} payload Details to change as an object
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<ProjectPatchResponse>}
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
   * Delete a project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<void>}
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
