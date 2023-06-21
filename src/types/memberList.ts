import { Member } from "./member";

export type MemberList = {
  members?: Array<Member>;
  err_code?: string;
  err_msg?: string;
};
