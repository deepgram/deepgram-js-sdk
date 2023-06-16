import { InvitationOptions } from "./invitationOptions";

export type InvitationList = {
  invites?: Array<InvitationOptions>;
  err_code?: string;
  err_msg?: string;
};
