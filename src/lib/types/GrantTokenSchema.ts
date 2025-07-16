export interface GrantTokenSchema extends Record<string, unknown> {
  /**
   * Time to live in seconds for the token. Defaults to 30 seconds.
   * @minimum 1
   * @maximum 3600
   * @example 30
   */
  ttl_seconds?: number;
}
