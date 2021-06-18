import { _request } from "./httpRequest";
import { KeyResponse, Key } from "./types";

export class Keys {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/projects";

  /**
   * Retrieves all keys associated with the provided projectId
   * @param projectId Unique identifier of the project containing API keys
   */
  async list(projectId: string): Promise<KeyResponse> {
    return _request<KeyResponse>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys`
    );
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
   */
  async create(
    projectId: string,
    comment: string,
    scopes: Array<string>
  ): Promise<Key> {
    return _request<Key>(
      "POST",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/keys`,
      JSON.stringify({ comment, scopes })
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
