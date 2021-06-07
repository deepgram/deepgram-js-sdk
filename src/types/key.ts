export type Key = {
  key: string;
  secret?: string;
  name: string;
  created: Date;
  scopes: Array<string>;
};
