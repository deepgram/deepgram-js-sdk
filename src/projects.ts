import {
  Project,
  ProjectPatchResponse,
  ProjectResponse,
  ProjectPatchRequest,
  RequestFunction,
  ErrorResponse,
  Message,
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
   * @returns {Promise<ProjectResponse | ErrorResponse>}
   */

  async list(
    endpoint = "v1/projects"
  ): Promise<ProjectResponse | ErrorResponse> {
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
   * @returns {Promise<Project | ErrorResponse>}
   */
  async get(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<Project | ErrorResponse> {
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
   * @returns {Promise<ProjectPatchResponse | ErrorResponse>}
   */
  async update(
    project: string | Project,
    payload: ProjectPatchRequest,
    endpoint = "v1/projects"
  ): Promise<ProjectPatchResponse | ErrorResponse> {
    const projectObj = project as Project;
    let projectId = project as string;

    if (projectObj.project_id) {
      projectId = projectObj.project_id;
    }

    return this._request(
      "PATCH",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}`,
      JSON.stringify(payload)
    );
  }

  /**
   * Delete a project.
   * @param {string} projectId Unique identifier of the project
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<Message | ErrorResponse>}
   */
  async delete(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<void | ErrorResponse> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}`
    );
  }
}
