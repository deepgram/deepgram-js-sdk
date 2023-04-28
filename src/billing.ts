import { BalanceList, Balance, RequestFunction } from "./types";

export class Billing {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves list of balance info of the specified project.
   * @param projectId string
   * @param endpoint string
   * @returns Promise<BalanceList>
   */
  async listBalances(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<BalanceList> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/balances`
    );
  }

  /**
   *
   * Retrieves balance info of a specified balance_id in the specified project.
   * @param projectId string
   * @param balanceId string
   * @param endpoint string
   * @returns Promise<Balance>
   */
  async getBalance(
    projectId: string,
    balanceId: string,
    endpoint = "v1/projects"
  ): Promise<Balance> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/balances/${balanceId}`
    );
  }
}
