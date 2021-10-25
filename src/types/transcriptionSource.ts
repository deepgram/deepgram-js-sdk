import { ReadStream } from "fs";

export type TranscriptionSource = UrlSource | BufferSource | ReadStreamSource;

export type ReadStreamSource = {
  stream: ReadStream;
  mimetype: string;
};

export type UrlSource = {
  url: string;
};

export type BufferSource = {
  buffer: Buffer;
  mimetype: string;
};
