import { _request } from "./httpRequest";
import { CreateKeyOptions, KeyResponse, Key } from "./types";

export class Keys {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/v1/projects";

  /**
   * Retrieves all keys associated with the provided projectId
   * @param projectId Unique identifier of the project containing API keys
   */
  async list(projectId: string): Promise<KeyResponse> {
    const response = await _request<KeyResponse>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys`
    );

    const output = response.api_keys.map((apiKey) => {
      return {
        ...apiKey, 
        ...apiKey.api_key
      }
    });

    return { api_keys: output };
  }

  /**
   * Retrieves a specific key associated with the provided projectId
   * @param projectId Unique identifier of the project containing API keys
   * @param keyId Unique identifier for the key to retrieve
   */
  async get(projectId: string, keyId: string): Promise<Key> {
    return _request<Key>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys/${keyId}`
    );
  }

  /**
   * Creates an API key with the provided scopes
   * @param projectId Unique identifier of the project to create an API key under
   * @param comment Comment to describe the key
   * @param scopes Permission scopes associated with the API key
   * @param options Optional options used when creating API keys
   */
  async create(
    projectId: string,
    comment: string,
    scopes: Array<string>,
    options?: CreateKeyOptions
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

    return _request<Key>(
      "POST",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys`,
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
   * Deletes an API key
   * @param projectId Unique identifier of the project to create an API key under
   * @param keyId Unique identifier for the key to delete
   */
  async delete(projectId: string, keyId: string): Promise<void> {
    return _request<void>(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys/${keyId}`
    );
  }
}
