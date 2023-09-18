export type CreateProjectKeyOptions = ExpirationOptions | TtlOptions;

interface ExpirationOptions extends CommonOptions {
  expiration_date: string;
}

export interface TtlOptions extends CommonOptions {
  time_to_live_in_seconds: string;
}

interface CommonOptions extends Record<string, unknown> {
  comment: string;
  scopes: [string];
  tags: [string];
  [key: string]: unknown;
}
