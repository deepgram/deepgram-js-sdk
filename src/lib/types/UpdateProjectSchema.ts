export interface UpdateProjectSchema extends Record<string, unknown> {
  name?: string;
  company?: string;
  [key: string]: unknown;
}
