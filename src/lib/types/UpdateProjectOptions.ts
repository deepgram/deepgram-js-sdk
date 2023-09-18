export interface UpdateProjectOptions extends Record<string, unknown> {
  name: string;
  company: string;
  [key: string]: unknown;
}
