import { _request } from "./httpRequest";
import { BalanceList, Balance } from "./types";

export class Billing {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves list of balance info of the specified project.
   * @param projectId Unique identifier of the project
   */
  async listBalances(projectId: string): Promise<BalanceList> {
    return _request<BalanceList>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/balances`
    );
  }

  /**
   * Retrieves balance info of a specified balance_id in the specified project.
   * @param projectId Unique identifier of the project
   * @param balanceId Unique identifier of the balance
   */

  async getBalance(projectId: string, balanceId: string): Promise<Balance> {
    return _request<Balance>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/balances/${balanceId}`
    );
  }
}
