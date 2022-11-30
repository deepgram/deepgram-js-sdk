import { DefaultOptions } from "./constants";
import { Keys } from "./keys";
import { Projects } from "./projects";
import { Transcriber } from "./transcription";
import { Usage } from "./usage";
import { Members } from "./members";
import { Invitation } from "./invitation";
import { Billing } from "./billing";
import { Scopes } from "./scopes";

import { validateOptions } from "./helpers";
import { _request } from "./httpRequest";

export class Deepgram {
  private _apiUrl: string;
  private _apiKey: string;
  private _requireSSL: boolean;

  keys: Keys;
  projects: Projects;
  transcription: Transcriber;
  usage: Usage;
  members: Members;
  invitation: Invitation;
  billing: Billing;
  scopes: Scopes;

  constructor(apiKey: string, apiUrl?: string, requireSSL?: boolean) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || DefaultOptions.apiUrl;
    this._requireSSL = requireSSL || DefaultOptions.requireSSL;

    /**
     * Ensures that the provided options were provided
     */
    validateOptions(this._apiKey, this._apiUrl);

    this.keys = new Keys(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.projects = new Projects(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.transcription = new Transcriber(
      this._apiKey,
      this._apiUrl,
      this._requireSSL
    );
    this.usage = new Usage(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.members = new Members(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.invitation = new Invitation(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.billing = new Billing(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
    this.scopes = new Scopes(
      this._apiKey,
      this._apiUrl,
      this._requireSSL,
      _request
    );
  }
}
