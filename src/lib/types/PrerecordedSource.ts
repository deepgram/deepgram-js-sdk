import { Readable } from "stream";

export type PrerecordedSource = UrlSource | BufferSource | ReadStreamSource;

export type FileSource = BufferSource | ReadStreamSource;

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
