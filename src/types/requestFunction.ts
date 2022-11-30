import { ReadStream } from "fs";
export type RequestFunction = NodeRequest | BrowserRequest;

export type NodeRequest = (
  method: string,
  apiKey: string,
  apiUrl: string,
  requireSSL: boolean,
  path: string,
  payload?: string | Buffer | ReadStream,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options?: Object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export type BrowserRequest = (
  method: string,
  apiKey: string,
  apiUrl: string,
  requireSSL: boolean,
  path: string,
  payload?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;
