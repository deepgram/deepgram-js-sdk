import { Readable } from "stream";

export type TranscriptionSource = UrlSource | BufferSource | ReadStreamSource;

export type ReadStreamSource = {
  stream: Readable;
  mimetype: string;
};

export type UrlSource = {
  url: string;
};

export type BufferSource = {
  buffer: Buffer;
  mimetype: string;
};
