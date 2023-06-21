import { Project } from "./project";

export type ProjectResponse = {
  projects: Array<Project>;
  err_code?: string;
  err_msg?: string;
};
