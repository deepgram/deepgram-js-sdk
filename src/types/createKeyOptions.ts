/**
 * Optional options used when creating an API key
 */
export type CreateKeyOptions = {
  /**
   * Date on which the key you would like to create should expire.
   */
  expirationDate?: Date;
  /**
   * Length of time (in seconds) during which the key you would like to create will remain valid.
   */
  timeToLive?: number;
};
