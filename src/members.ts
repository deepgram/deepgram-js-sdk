import { _request } from "./httpRequest";
import { MemberResponse, Member } from "./types";

export class Members {
  constructor(private _credentials: string, private _apiUrl: string) {}

  private apiPath = "/projects";

  /**
   * Retrieves all members associated with the provided projectId
   * @param projectId Unique identifier of the project containing members
   */
  async list(projectId: string): Promise<MemberResponse> {
    return _request<MemberResponse>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members`
    );
  }

  /**
   * Retrieves a specific member associated with the provided projectId
   * @param projectId Unique identifier of the project containing the member
   * @param memberId Unique identifier for the member to retrieve
   */
  async get(projectId: string, memberId: string): Promise<Member> {
    return _request<Member>(
      "GET",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${memberId}`
    );
  }

  /**
   * Creates an API key with the provided scopes
   * @param projectId Unique identifier of the project to create an API key under
   * @param inviteCode Invite code for the member to add
   */
  async create(projectId: string, inviteCode: string): Promise<void> {
    await _request<Member>(
      "POST",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members`,
      JSON.stringify({ invite_code: inviteCode })
    );
  }

  /**
   * Deletes an API key
   * @param projectId Unique identifier of the project to create an API key under
   * @param memberId Unique identifier for the member to delete
   */
  async delete(projectId: string, keyId: string): Promise<void> {
    return _request<void>(
      "DELETE",
      this._credentials,
      this._apiUrl,
      `${this.apiPath}/${projectId}/members/${keyId}`
    );
  }
}
