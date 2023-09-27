export interface CreateProjectKeyResponse {
  api_key_id: string;
  key: string;
  comment?: string;
  scopes: string[];
  tags?: string[];
  created: string;
}
