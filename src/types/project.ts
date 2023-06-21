/**
 * Deepgram project
 */
export type Project = {
  /**
   * Unique identifier of the project
   */
  project_id: string;
  /**
   * User provided name of the project
   */
  name?: string;
  /**
   * Name of the company associated with the project. Optional.
   */
  company?: string;
  err_code?: string;
  err_msg?: string;
};
