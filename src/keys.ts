import {
  CreateKeyOptions,
  KeyResponse,
  Key,
  KeyResponseObj,
  RequestFunction,
} from "./types";

export class Keys {
  constructor(
    private _credentials: string,
    private _apiUrl: string,
    private _requireSSL: boolean,
    private _request: RequestFunction
  ) {}

  /**
   * @param projectId string
   * @param endpoint string
   * @returns Promise<KeyResponse>
   */
  async list(
    projectId: string,
    endpoint = "v1/projects"
  ): Promise<KeyResponse> {
    const response = await this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/keys`
    );

    const output = response.api_keys.map((apiKey: KeyResponseObj) => {
      return {
        ...apiKey,
        ...apiKey.api_key,
      };
    });

    return { api_keys: output };
  }

  /**
   * @param projectId string
   * @param keyId string
   * @param endpoint string
   * @returns Promise<Key>
   */
  async get(
    projectId: string,
    keyId: string,
    endpoint = "v1/projects"
  ): Promise<Key> {
    return this._request(
      "GET",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/keys/${keyId}`
    );
  }

  /**
   * @param projectId string
   * @param comment string
   * @param scopes Array<string>
   * @param options CreateKeyOptions
   * @param endpoint string
   * @returns Promise<Key>
   */
  async create(
    projectId: string,
    comment: string,
    scopes: Array<string>,
    options?: CreateKeyOptions,
    endpoint = "v1/projects"
  ): Promise<Key> {
    /** Throw an error if the user provided both expirationDate and timeToLive */
    if (
      options &&
      options.expirationDate !== undefined &&
      options.timeToLive !== undefined
    ) {
      throw new Error(
        "Please provide expirationDate or timeToLive or neither. Providing both is not allowed."
      );
    }

    return this._request(
      "POST",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/keys`,
      JSON.stringify({
        comment,
        scopes,
        expiration_date:
          options && options.expirationDate
            ? options.expirationDate
            : undefined,
        time_to_live_in_seconds:
          options && options.timeToLive ? options.timeToLive : undefined,
      })
    );
  }

  /**
   * @param projectId string
   * @param keyId string
   * @param endpoint string
   * @returns Promise<void>
   */
  async delete(
    projectId: string,
    keyId: string,
    endpoint = "v1/projects"
  ): Promise<void> {
    return this._request(
      "DELETE",
      this._credentials,
      this._apiUrl,
      this._requireSSL,
      `/${endpoint}/${projectId}/keys/${keyId}`
    );
  }
}
