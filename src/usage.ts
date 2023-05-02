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
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * @param projectId string
   * @param options UsageRequestListOptions
   * @param endpoint string
   * @returns Promise<UsageRequestList>
   */
  async listRequests(
    projectId: string,
    options?: UsageRequestListOptions,
    endpoint = "v1/projects"
  ): Promise<UsageRequestList> {
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
   * @param projectId string
   * @param requestId string
   * @param endpoint string
   * @returns Promise<UsageRequest>
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
   * @param projectId string
   * @param options UsageOptions
   * @param endpoint string
   * @returns Promise<UsageResponse>
   */
  async getUsage(
    projectId: string,
    options?: UsageOptions,
    endpoint = "v1/projects"
  ): Promise<UsageResponse> {
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
   * @param projectId string
   * @param options UsageFieldOptions
   * @param endpoint string
   * @returns Promise<UsageField>
   */
  async getFields(
    projectId: string,
    options?: UsageFieldOptions,
    endpoint = "v1/projects"
  ): Promise<UsageField> {
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
