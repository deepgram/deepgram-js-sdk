import querystring from "querystring";
import {
  RequestFunction,
  UsageField,
  UsageFieldOptions,
  UsageOptions,
  UsageRequest,
  UsageRequestList,
  UsageRequestListOptions,
  UsageResponse,
} from "./types";

export class Usage {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _request: RequestFunction
  ) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves all requests associated with the provided projectId based
   * on the provided options
   * @param projectId Unique identifier of the project
   * @param options Additional filter options
   */
  async listRequests(
    projectId: string,
    options?: UsageRequestListOptions
  ): Promise<UsageRequestList> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/requests?${querystring.stringify(
        requestOptions
      )}`
    );
  }

  /**
   * Retrieves a specific request associated with the provided projectId
   * @param projectId Unique identifier of the project
   * @param requestId Unique identifier for the request to retrieve
   */
  async getRequest(
    projectId: string,
    requestId: string
  ): Promise<UsageRequest> {
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/requests/${requestId}`
    );
  }

  /**
   * Retrieves usage associated with the provided projectId based
   * on the provided options
   * @param projectId Unique identifier of the project
   * @param options Options to filter usage
   */
  async getUsage(
    projectId: string,
    options?: UsageOptions
  ): Promise<UsageResponse> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/usage?${querystring.stringify(
        requestOptions
      )}`
    );
  }

  /**
   * Retrieves features used by the provided projectId based
   * on the provided options
   * @param projectId Unique identifier of the project
   * @param options Options to filter usage
   */
  async getFields(
    projectId: string,
    options?: UsageFieldOptions
  ): Promise<UsageField> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/usage/fields?${querystring.stringify(
        requestOptions
      )}`
    );
  }
}
