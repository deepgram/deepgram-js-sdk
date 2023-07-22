import { Readable } from "stream";

export type PreRecordedSource = UrlSource | BufferSource | ReadStreamSource;

export interface ReadStreamSource {
  stream: Readable;
  mimetype: string;
}

export interface UrlSource {
  url: string;
}

export interface BufferSource {
  buffer: Buffer;
  mimetype: string;
}
