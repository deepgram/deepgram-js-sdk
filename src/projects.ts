import { _request } from "./httpRequest";
import { Project, ProjectResponse } from "./types";

export class Projects {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Returns all projects accessible by the API key
   */
  async list(): Promise<ProjectResponse> {
    return _request<ProjectResponse>(
      "GET",
      this._credentials,
      this._apiUrl,
      this.apiPath
    );
  }

  /**
   * Retrieves a specific project based on the provided projectId
   * @param projectId Unique identifier of the project to retrieve
   */
  async get(projectId: string): Promise<Project> {
    return _request<Project>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}`
    );
  }
}
