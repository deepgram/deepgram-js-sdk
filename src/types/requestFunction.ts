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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export type BrowserRequest = (
  method: string,
  api_key: string,
  apiUrl: string,
  path: string,
  payload?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;
