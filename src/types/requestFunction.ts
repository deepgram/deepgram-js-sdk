import { ReadStream } from "fs";
export type RequestFunction = NodeRequest | BrowserRequest;

export type NodeRequest = (
  method: string,
  api_key: string,
  apiUrl: string,
  path: string,
  payload?: string | Buffer | ReadStream,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options?: Object
) => Promise<any>;

export type BrowserRequest = (
  method: string,
  api_key: string,
  apiUrl: string,
  path: string,
  payload?: string
) => Promise<any>;
