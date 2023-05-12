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
  ErrorResponse
} from "./types";

export class Usage {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * Retrieves all requests associated with the provided project_id based on the provided options.
   * @param {string} projectId Unique identifier of the project
   * @param {UsageRequestListOptions} options Additional filter options
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<UsageRequestList | ErrorResponse>}
   */
  async listRequests(
    projectId: string,
    options?: UsageRequestListOptions,
    endpoint = "v1/projects"
  ): Promise<UsageRequestList | ErrorResponse> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/requests?${querystring.stringify(
        requestOptions
      )}`
    );
  }

  /**
   * Retrieves a specific request associated with the provided project_id.
   * @param {string} projectId Unique identifier of the project
   * @param {string} requestId Unique identifier of the request
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<UsageRequest>}
   */
  async getRequest(
    projectId: string,
    requestId: string,
    endpoint = "v1/projects"
  ): Promise<UsageRequest> {
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/requests/${requestId}`
    );
  }

  /**
   * Retrieves usage associated with the provided project_id based on the provided options.
   * @param {string} projectId Unique identifier of the project
   * @param {UsageOptions} options Options to filter usage
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<UsageResponse | ErrorResponse>}
   */
  async getUsage(
    projectId: string,
    options?: UsageOptions,
    endpoint = "v1/projects"
  ): Promise<UsageResponse | ErrorResponse> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/usage?${querystring.stringify(requestOptions)}`
    );
  }

  /**
   * Retrieves features used by the provided project_id based on the provided options.
   * @param {string} projectId Unique identifier of the project
   * @param {UsageFieldOptions} options Options to filter usage
   * @param {string} endpoint Custom API endpoint
   *
   * @returns {Promise<UsageField | ErrorResponse>}
   */
  async getFields(
    projectId: string,
    options?: UsageFieldOptions,
    endpoint = "v1/projects"
  ): Promise<UsageField | ErrorResponse> {
    const requestOptions = { ...{}, ...options };
    return await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/usage/fields?${querystring.stringify(
        requestOptions
      )}`
    );
  }
}
