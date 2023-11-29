import { Readable } from "stream";

export type PrerecordedSource = UrlSource | Buffer | Readable;

export type FileSource = Buffer | Readable;

export interface UrlSource {
  url: string;
}
